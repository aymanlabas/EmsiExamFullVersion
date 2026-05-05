import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { getSoumissionsByEtudiant } from '../services/soumissionService';

const ResultPage = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const state = location.state || {};

    const [resultats, setResultats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchResults(user.id);
        }
    }, [user]);

    const fetchResults = async (studentId) => {
        try {
            setLoading(true);
            const data = await getSoumissionsByEtudiant(studentId);

            if (!Array.isArray(data)) {
                setResultats([]);
                setLoading(false);
                return;
            }

            const processed = data.map(s => {
                let statut = 'En attente';
                const noteVal = (s.note !== null && s.note !== undefined) ? parseFloat(s.note) : null;
                if (noteVal !== null && !isNaN(noteVal)) {
                    statut = noteVal >= 10 ? 'Validé' : 'Non validé';
                }
                return {
                    ...s,
                    note: noteVal,
                    statut,
                    examTitre: s.examen?.titre || 'Examen inconnu',
                    idExamen: s.examen?.id
                };
            });

            setResultats(processed);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching results:", error);
            setResultats([]);
            setLoading(false);
        }
    };

    const getStatutStyle = (statut) => {
        switch (statut) {
            case 'Validé': return 'bg-green-100 text-green-800 border-green-300';
            case 'Non validé': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }
    };

    const getBorderColor = (statut) => {
        switch (statut) {
            case 'Validé': return '#10b981';
            case 'Non validé': return '#ef4444';
            default: return '#f59e0b';
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">{t('common.loading')}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('navbar.my_results')}</h1>

            {state.justSubmitted && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg text-center shadow">
                    <h2 className="text-lg font-bold">✅ Soumission enregistrée !</h2>
                    <p className="text-sm mt-1">Votre réponse PDF a été reçue. Vous serez notifié quand le professeur aura corrigé.</p>
                </div>
            )}

            {state.isLate && (
                <div className="mb-6 p-4 bg-orange-100 border border-orange-400 text-orange-800 rounded-lg text-center shadow flex items-center justify-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <h2 className="text-lg font-bold">Soumission hors délai</h2>
                        <p className="text-sm">Le temps était écoulé lors de votre soumission. Le professeur en sera informé.</p>
                    </div>
                </div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-gray-800">{resultats.length}</div>
                    <div className="text-sm text-gray-500">Total examens</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-green-600">{resultats.filter(r => r.statut === 'Validé').length}</div>
                    <div className="text-sm text-gray-500">Validés</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{resultats.filter(r => r.statut === 'En attente').length}</div>
                    <div className="text-sm text-gray-500">En attente</div>
                </div>
            </div>

            {resultats.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
                    Vous n'avez pas encore passé d'examen.
                </div>
            ) : (
                <div className="space-y-5">
                    {resultats.map((res) => (
                        <div
                            key={res.id}
                            className="bg-white p-6 rounded-lg shadow-md border-l-4"
                            style={{ borderColor: getBorderColor(res.statut) }}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{res.examTitre}</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Soumis le : {res.dateSoumission ? new Date(res.dateSoumission).toLocaleString() : 'Date inconnue'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Examen #{res.idExamen} · Étudiant #{res.etudiant?.id}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-2 min-w-[100px]">
                                    {res.note !== null ? (
                                        <div className="text-3xl font-bold text-gray-800">
                                            {res.note.toFixed(1)}<span className="text-lg text-gray-400">/20</span>
                                        </div>
                                    ) : (
                                        <div className="text-lg font-semibold text-gray-400">—/20</div>
                                    )}
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatutStyle(res.statut)}`}>
                                        {res.statut}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 text-center">
                <Link to="/exams" className="text-green-700 hover:text-green-900 font-semibold hover:underline">
                    ← {t('navbar.dashboard')}
                </Link>
            </div>
        </div>
    );
};

export default ResultPage;
