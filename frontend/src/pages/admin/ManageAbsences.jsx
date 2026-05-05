import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAbsences, createAbsence, updateAbsence, deleteAbsence } from '../../services/absenceService';
import { getEtudiants } from '../../services/etudiantService';
import { getExamens } from '../../services/examenService';

const EMPTY_FORM = { etudiant: '', examen: '', date: '', justification: false };

const ManageAbsences = () => {
    const { t } = useTranslation();
    const [absences, setAbsences] = useState([]);
    const [etudiants, setEtudiants] = useState([]);
    const [examens, setExamens] = useState([]);
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
            const [absencesData, etudiantsData, examensData] = await Promise.all([
                getAbsences(), getEtudiants(), getExamens()
            ]);
            setAbsences(absencesData);
            setEtudiants(etudiantsData);
            setExamens(examensData);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async () => {
        if (!form.etudiant || !form.examen || !form.date) return;
        setSaving(true);
        try {
            const payload = {
                date: form.date,
                justification: form.justification,
                etudiant: { id: Number(form.etudiant) },
                examen: { id: Number(form.examen) }
            };
            if (editingId) {
                await updateAbsence(editingId, payload);
            } else {
                await createAbsence(payload);
            }
            await fetchData();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (a) => {
        setForm({
            etudiant: a.etudiant?.id || '',
            examen: a.examen?.id || '',
            date: a.date ? a.date.slice(0, 10) : '',
            justification: a.justification || false
        });
        setEditingId(a.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette absence ?')) return;
        try {
            await deleteAbsence(id);
            setAbsences(absences.filter(a => a.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la suppression.');
        }
    };

    const toggleJustification = async (a) => {
        try {
            const payload = {
                date: a.date,
                justification: !a.justification,
                etudiant: a.etudiant,
                examen: a.examen
            };
            const updated = await updateAbsence(a.id, payload);
            setAbsences(absences.map(abs => abs.id === updated.id ? updated : abs));
        } catch (err) {
            alert('Erreur lors de la mise à jour de la justification.');
        }
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(false);
        setError(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Absences</h1>
                    <p className="text-gray-500 text-sm mt-1">Suivi des absences aux examens</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                    {showForm ? `✕ ${t('common.close')}` : '➕ Enregistrer une absence'}
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
                        {editingId ? "Modifier l'absence" : "Nouvelle absence"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Étudiant <span className="text-red-500">*</span></label>
                            <select
                                value={form.etudiant}
                                onChange={e => setForm({ ...form, etudiant: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="">-- Sélectionner --</option>
                                {etudiants.map(e => (
                                    <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Examen <span className="text-red-500">*</span></label>
                            <select
                                value={form.examen}
                                onChange={e => setForm({ ...form, examen: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="">-- Sélectionner --</option>
                                {examens.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.titre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Justifiée</label>
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.justification}
                                    onChange={e => setForm({ ...form, justification: e.target.checked })}
                                    className="w-5 h-5 accent-orange-600"
                                />
                                <span className="text-gray-600 text-sm">{form.justification ? 'Oui' : 'Non'}</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-2 rounded font-semibold transition">
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
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Étudiant</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Examen</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Justifiée</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {absences.map(a => (
                                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 text-gray-500">#{a.id}</td>
                                    <td className="py-3 px-4 font-semibold text-gray-800">
                                        {a.etudiant ? `${a.etudiant.prenom} ${a.etudiant.nom}` : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {a.examen ? a.examen.titre : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-gray-500">{a.date ? new Date(a.date).toLocaleDateString() : '—'}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => toggleJustification(a)}
                                            className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition ${a.justification ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                        >
                                            {a.justification ? '✅ Oui' : '❌ Non'}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(a)} className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            ✏️ {t('common.edit')}
                                        </button>
                                        <button onClick={() => handleDelete(a.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            🗑️ {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {absences.length === 0 && (
                                <tr><td colSpan="6" className="py-8 text-center text-gray-400">Aucune absence enregistrée</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageAbsences;
