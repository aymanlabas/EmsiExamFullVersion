import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { getExamenById, uploadFile } from '../services/examenService';
import { createSoumission } from '../services/soumissionService';

const ExamPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Soumission model fields
    const [reponsepdf, setReponsepdf] = useState(null); // File object
    const [pdfFileName, setPdfFileName] = useState('');

    const [timeLeft, setTimeLeft] = useState(null);
    const [isLate, setIsLate] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                setLoading(true);
                const data = await getExamenById(id);
                setExam(data);

                // Calculate time left based on duration or end date
                const now = new Date();
                const end = new Date(data.dateFin);
                const diffSeconds = Math.floor((end - now) / 1000);

                // Stay within duration limit
                const maxSeconds = (data.duree || 0) * 60;
                setTimeLeft(Math.min(diffSeconds, maxSeconds));

                setLoading(false);
            } catch (err) {
                console.error("Error fetching exam:", err);
                setError('Impossible de charger les détails de l\'examen.');
                setLoading(false);
            }
        };
        if (id) fetchExam();
    }, [id]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAutoSubmit = () => {
        setIsLate(true);
        submitSoumission(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setReponsepdf(file);
            setPdfFileName(file.name);
        } else {
            alert('Veuillez sélectionner un fichier PDF valide.');
        }
    };

    const submitSoumission = async (isAutoSubmit = false) => {
        setSubmitting(true);

        try {
            let uploadedFilename = pdfFileName;

            // If there's a file and it's not just a filename from a previous state
            if (reponsepdf && typeof reponsepdf !== 'string') {
                uploadedFilename = await uploadFile(reponsepdf);
            }

            const payload = {
                reponsePdf: uploadedFilename || (isAutoSubmit ? '(soumission automatique — aucun fichier)' : 'reponse.pdf'),
                dateSoumission: new Date().toISOString().slice(0, 19), // Format: YYYY-MM-DDTHH:MM:SS
                note: null,
                examen: { id: Number(id) },
                etudiant: { id: user?.id }
            };

            console.log("Submitting payload:", payload);
            await createSoumission(payload);
            setSubmitting(false);
            navigate('/results', { state: { justSubmitted: true, isLate: isAutoSubmit } });
        } catch (error) {
            console.error("Error submitting:", error);
            const msg = error.response?.data?.message || error.message || "Erreur inconnue";
            alert(`Erreur lors de la soumission de votre réponse: ${msg}`);
            setSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reponsepdf) {
            alert('Veuillez télécharger votre réponse en PDF avant de soumettre.');
            return;
        }
        submitSoumission(false);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Chargement de l'examen...</div>;
    if (error) return <div className="text-center py-20 text-red-600 font-semibold">{error}</div>;

    const isTimeLow = timeLeft !== null && timeLeft <= 300;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header sticky bar */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{exam.titre}</h1>
                    <p className="text-sm text-gray-500">Durée : {exam.duree} min</p>
                </div>
                {timeLeft !== null && (
                    <div className={`text-xl font-bold px-4 py-2 rounded-lg border-2 ${isTimeLow ? 'text-red-600 border-red-400 animate-pulse' : 'text-green-800 border-green-200'}`}>
                        ⏱ {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {isTimeLow && timeLeft > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm font-semibold text-center">
                    ⚠️ Moins de 5 minutes restantes ! Soumettez votre réponse rapidement.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Exam PDF subject */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">📄 Sujet de l'examen</h2>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-3xl">📋</span>
                        <div>
                            <p className="font-semibold text-gray-700">{exam.fichierPdf}</p>
                            <p className="text-xs text-gray-500">Téléchargez et lisez le sujet avant de répondre</p>
                        </div>
                        <button
                            type="button"
                            className="ml-auto bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded font-semibold text-sm transition"
                            onClick={() => {
                                if (exam.fichierPdf) {
                                    window.open(`http://localhost:8088/api/files/download/${exam.fichierPdf}`, '_blank');
                                } else {
                                    alert("Aucun fichier disponible pour cet examen.");
                                }
                            }}
                        >
                            ⬇️ Télécharger
                        </button>
                    </div>
                </div>

                {/* PDF Answer Upload — Soumission.reponsepdf */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-1">📤 Soumettre votre réponse (PDF)</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Préparez votre réponse, exportez-la en PDF, puis uploadez-la ici.
                    </p>

                    <label className="block">
                        <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition ${reponsepdf ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'}`}>
                            {reponsepdf ? (
                                <>
                                    <span className="text-4xl mb-2">✅</span>
                                    <p className="font-semibold text-green-700">{pdfFileName}</p>
                                    <p className="text-sm text-green-600 mt-1">Fichier prêt à soumettre</p>
                                </>
                            ) : (
                                <>
                                    <span className="text-4xl mb-2">📁</span>
                                    <p className="font-semibold text-gray-600">Cliquez pour sélectionner votre PDF</p>
                                    <p className="text-xs text-gray-400 mt-1">Format accepté : PDF uniquement</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {reponsepdf && (
                        <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <span className="text-sm font-medium text-green-700">📄 {pdfFileName}</span>
                            <button
                                type="button"
                                onClick={() => { setReponsepdf(null); setPdfFileName(''); }}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold"
                            >
                                ✕ Supprimer
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit button */}
                <div className="flex justify-end pb-4">
                    <button
                        type="submit"
                        disabled={submitting || !reponsepdf}
                        className={`px-8 py-3 rounded-lg font-bold text-white transition shadow-lg ${(submitting || !reponsepdf) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'}`}
                    >
                        {submitting ? 'Soumission en cours...' : '✅ Soumettre ma réponse'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExamPage;
