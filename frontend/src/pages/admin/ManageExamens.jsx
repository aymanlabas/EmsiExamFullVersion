import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getExamens, createExamen, updateExamen, deleteExamen } from '../../services/examenService';
import { getProfesseurs } from '../../services/professeurService';

const EMPTY_FORM = { titre: '', fichierPdf: '', dateDebut: '', dateFin: '', duree: '', professeur: null };

const ManageExamens = () => {
    const { t } = useTranslation();
    const [examens, setExamens] = useState([]);
    const [professeurs, setProfesseurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [examData, profData] = await Promise.all([getExamens(), getProfesseurs()]);
            setExamens(examData);
            setProfesseurs(profData);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async () => {
        if (!form.titre || !form.dateDebut || !form.dateFin || !form.duree) return;
        setSaving(true);
        try {
            const payload = {
                titre: form.titre,
                fichierPdf: form.fichierPdf,
                dateDebut: form.dateDebut,
                dateFin: form.dateFin,
                duree: Number(form.duree),
                professeur: form.professeur ? { id: Number(form.professeur) } : null,
            };
            if (editingId) {
                await updateExamen(editingId, payload);
            } else {
                await createExamen(payload);
            }
            await fetchData();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (ex) => {
        setForm({
            titre: ex.titre || '',
            fichierPdf: ex.fichierPdf || '',
            dateDebut: ex.dateDebut ? ex.dateDebut.slice(0, 16) : '',
            dateFin: ex.dateFin ? ex.dateFin.slice(0, 16) : '',
            duree: ex.duree || '',
            professeur: ex.professeur?.id || '',
        });
        setEditingId(ex.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet examen ?')) return;
        try {
            await deleteExamen(id);
            setExamens(examens.filter(ex => ex.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la suppression.');
        }
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(false);
        setError(null);
    };

    const getStatus = (debut, fin) => {
        const now = new Date();
        if (now < new Date(debut)) return { text: 'À venir', color: 'bg-yellow-100 text-yellow-800' };
        if (now > new Date(fin)) return { text: 'Terminé', color: 'bg-red-100 text-red-800' };
        return { text: 'En cours', color: 'bg-green-100 text-green-800' };
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t('navbar.exams')}</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                    {showForm ? `✕ ${t('common.close')}` : `➕ ${t('common.add')} ${t('navbar.exams')}`}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 flex justify-between items-center">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
                </div>
            )}

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        {editingId ? "Modifier l'examen" : "Créer un examen"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Titre <span className="text-red-500">*</span></label>
                            <input type="text" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fichier PDF</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={e => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setForm({ ...form, fichierPdf: e.target.files[0].name });
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-green-50 file:text-green-700
                                        hover:file:bg-green-100
                                        border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                                {form.fichierPdf && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sélectionné : <strong>{form.fichierPdf}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Durée (min) <span className="text-red-500">*</span></label>
                            <input type="number" value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date début <span className="text-red-500">*</span></label>
                            <input type="datetime-local" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date fin <span className="text-red-500">*</span></label>
                            <input type="datetime-local" value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Professeur</label>
                            <select value={form.professeur} onChange={e => setForm({ ...form, professeur: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none">
                                <option value="">-- Sélectionner --</option>
                                {professeurs.map(p => (
                                    <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSave} disabled={saving}
                            className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white px-6 py-2 rounded font-semibold transition">
                            {saving ? '⏳ Sauvegarde...' : (editingId ? t('common.update') : t('common.add'))}
                        </button>
                        <button onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold transition">
                            {t('common.cancel')}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-100">
                {loading ? (
                    <div className="py-12 text-center text-gray-400">⏳ Chargement...</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Titre</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Professeur</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Durée</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Période</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Statut</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examens.map(ex => {
                                const status = getStatus(ex.dateDebut, ex.dateFin);
                                return (
                                    <tr key={ex.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                        <td className="py-3 px-4 font-semibold text-gray-800">{ex.titre}</td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {ex.professeur ? `${ex.professeur.prenom} ${ex.professeur.nom}` : '—'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{ex.duree} min</td>
                                        <td className="py-3 px-4 text-gray-500 text-sm">
                                            {ex.dateDebut ? new Date(ex.dateDebut).toLocaleDateString() : '—'} → {ex.dateFin ? new Date(ex.dateFin).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.color}`}>{status.text}</span>
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            <button onClick={() => handleEdit(ex)} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-semibold transition">
                                                ✏️ {t('common.edit')}
                                            </button>
                                            <button onClick={() => handleDelete(ex.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-semibold transition">
                                                🗑️ {t('common.delete')}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {examens.length === 0 && (
                                <tr><td colSpan="6" className="py-8 text-center text-gray-400">Aucun examen trouvé</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageExamens;
