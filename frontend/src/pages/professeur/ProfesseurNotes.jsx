import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { getExamensByProfesseur } from '../../services/examenService';
import { getSoumissionsByExamen, updateSoumission } from '../../services/soumissionService';

const ProfesseurNotes = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editNote, setEditNote] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchNotes(user.id);
        }
    }, [user]);

    const fetchNotes = async (profId) => {
        try {
            setLoading(true);
            const examens = await getExamensByProfesseur(profId);
            if (!Array.isArray(examens)) {
                setNotes([]);
                setLoading(false);
                return;
            }

            const allSoumissions = [];

            for (const exam of examens) {
                if (!exam?.id) continue;
                const soumissions = await getSoumissionsByExamen(exam.id);
                if (Array.isArray(soumissions)) {
                    const mapped = soumissions.map(s => {
                        let statut = 'En attente';
                        const noteVal = (s.note !== null && s.note !== undefined) ? parseFloat(s.note) : null;
                        if (noteVal !== null && !isNaN(noteVal)) {
                            statut = noteVal >= 10 ? 'Validé' : 'Non validé';
                        }
                        return {
                            ...s,
                            note: noteVal,
                            etudiantNom: s.etudiant ? `${s.etudiant.prenom || ''} ${s.etudiant.nom || ''}` : 'Inconnu',
                            examenTitre: exam.titre || 'Sans titre',
                            statut,
                        };
                    });
                    allSoumissions.push(...mapped);
                }
            }

            allSoumissions.sort((a, b) => {
                const dA = a.dateSoumission ? new Date(a.dateSoumission).getTime() : 0;
                const dB = b.dateSoumission ? new Date(b.dateSoumission).getTime() : 0;
                return (isNaN(dB) ? 0 : dB) - (isNaN(dA) ? 0 : dA);
            });

            setNotes(allSoumissions);
        } catch (error) {
            console.error("Error fetching notes:", error);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditNote = (id, currentNote) => {
        setEditingId(id);
        setEditNote(currentNote !== null ? currentNote.toString() : '');
    };

    const handleSaveNote = async (id) => {
        const noteValue = parseFloat(editNote);
        if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
            alert('La note doit être entre 0 et 20');
            return;
        }

        try {
            const target = notes.find(n => n.id === id);
            if (!target) return;

            // Exclude frontend-only mapped fields
            const { etudiantNom, examenTitre, statut, ...updatedData } = target;
            updatedData.note = noteValue;

            await updateSoumission(id, updatedData);

            setNotes(notes.map(n => n.id === id ? { ...n, note: noteValue, statut: noteValue >= 10 ? 'Validé' : 'Non validé' } : n));
            setEditingId(null);
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Erreur lors de l'enregistrement de la note.");
        }
    };

    const getStatutColor = (statut) => {
        switch (statut) {
            case 'Validé': return 'bg-green-100 text-green-800';
            case 'Non validé': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('navbar.grades')}</h1>
            <p className="text-gray-500 mb-6">Corrigez et attribuez les notes aux soumissions des étudiants</p>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Étudiant</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Examen</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Date soumission</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Note /20</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Statut</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4 text-gray-500">Chargement...</td></tr>
                        ) : notes.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4 text-gray-500">Aucune soumission trouvée.</td></tr>
                        ) : notes.map(n => (
                            <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="py-3 px-4 font-semibold text-gray-800">{n.etudiantNom}</td>
                                <td className="py-3 px-4 text-gray-600">{n.examenTitre}</td>
                                <td className="py-3 px-4 text-gray-500 text-sm">
                                    {n.dateSoumission ? new Date(n.dateSoumission).toLocaleString() : 'Date inconnue'}
                                </td>
                                <td className="py-3 px-4">
                                    {editingId === n.id ? (
                                        <input type="number" value={editNote} onChange={e => setEditNote(e.target.value)}
                                            min="0" max="20" step="0.5"
                                            className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className={`font-bold ${n.note !== null ? (n.note >= 10 ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}`}>
                                            {n.note !== null ? n.note.toFixed(1) : '—'}
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatutColor(n.statut)}`}>
                                        {n.statut}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right space-x-2">
                                    {editingId === n.id ? (
                                        <>
                                            <button onClick={() => handleSaveNote(n.id)} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-semibold transition">
                                                ✅ Enregistrer
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-semibold transition">
                                                {t('common.cancel')}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditNote(n.id, n.note)} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-semibold transition">
                                                ✏️ {n.note !== null ? t('common.edit') : t('common.add')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (n.reponsePdf && !n.reponsePdf.includes('automatique')) {
                                                        window.open(`http://localhost:8088/api/files/download/${n.reponsePdf}`, '_blank');
                                                    } else {
                                                        alert("Aucun fichier de réponse disponible (soumission automatique ou vide).");
                                                    }
                                                }}
                                                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded text-sm font-semibold transition"
                                            >
                                                📄 Voir PDF
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfesseurNotes;
