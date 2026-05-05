import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getSoumissions, createSoumission, updateSoumission, deleteSoumission } from '../../services/soumissionService';
import { getEtudiants } from '../../services/etudiantService';
import { getExamens } from '../../services/examenService';

const EMPTY_FORM = { reponsePdf: '', dateSoumission: '', note: '', etudiant: null, examen: null };

const ManageSoumissions = () => {
    const { t } = useTranslation();
    const [soumissions, setSoumissions] = useState([]);
    const [etudiants, setEtudiants] = useState([]);
    const [examens, setExamens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [filterExam, setFilterExam] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [soumissionsData, etudiantsData, examensData] = await Promise.all([
                getSoumissions(), getEtudiants(), getExamens()
            ]);
            setSoumissions(Array.isArray(soumissionsData) ? soumissionsData : []);
            setEtudiants(Array.isArray(etudiantsData) ? etudiantsData : []);
            setExamens(Array.isArray(examensData) ? examensData : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async () => {
        if (!form.etudiant || !form.examen || !form.dateSoumission) return;
        setSaving(true);
        try {
            const payload = {
                reponsePdf: form.reponsePdf,
                dateSoumission: form.dateSoumission,
                note: form.note ? parseFloat(form.note) : null,
                etudiant: { id: Number(form.etudiant) },
                examen: { id: Number(form.examen) }
            };
            if (editingId) {
                await updateSoumission(editingId, payload);
            } else {
                await createSoumission(payload);
            }
            await fetchData();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (s) => {
        setForm({
            reponsePdf: s.reponsePdf || '',
            dateSoumission: s.dateSoumission ? s.dateSoumission.slice(0, 16) : '',
            note: s.note !== null ? s.note : '',
            etudiant: s.etudiant?.id || '',
            examen: s.examen?.id || '',
        });
        setEditingId(s.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette soumission ?')) return;
        try {
            await deleteSoumission(id);
            setSoumissions(soumissions.filter(s => s.id !== id));
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

    const filtered = filterExam
        ? soumissions.filter(s => s.examen?.id === Number(filterExam))
        : soumissions;

    const getNoteColor = (note) => {
        if (note === null || note === undefined) return 'bg-yellow-100 text-yellow-800';
        return note >= 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const stats = {
        total: soumissions.length,
        corrected: soumissions.filter(s => s.note !== null && s.note !== undefined).length,
        pending: soumissions.filter(s => s.note === null || s.note === undefined).length,
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Soumissions</h1>
                    <p className="text-gray-500 text-sm mt-1">Gérer les soumissions de fichiers PDF</p>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-sm text-gray-500">Filtrer par examen :</span>
                    <select
                        value={filterExam}
                        onChange={e => setFilterExam(e.target.value)}
                        className="px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                    >
                        <option value="">Tous les examens</option>
                        {examens.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.titre}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap"
                    >
                        {showForm ? `✕ ${t('common.close')}` : '➕ Nouvelle Soumission'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 flex justify-between items-center">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                    <div className="text-sm text-gray-500">Total soumissions</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.corrected}</div>
                    <div className="text-sm text-gray-500">Corrigées</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-gray-500">En attente</div>
                </div>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        {editingId ? "Modifier la soumission" : "Nouvelle soumission"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Étudiant <span className="text-red-500">*</span></label>
                            <select
                                value={form.etudiant}
                                onChange={e => setForm({ ...form, etudiant: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="">-- Sélectionner --</option>
                                {examens.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.titre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fichier PDF</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={e => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setForm({ ...form, reponsePdf: e.target.files[0].name });
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-purple-50 file:text-purple-700
                                        hover:file:bg-purple-100
                                        border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                                {form.reponsePdf && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sélectionné : <strong>{form.reponsePdf}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date soumission <span className="text-red-500">*</span></label>
                            <input type="datetime-local" value={form.dateSoumission} onChange={e => setForm({ ...form, dateSoumission: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Note (/20)</label>
                            <input type="number" step="0.5" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded font-semibold transition">
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
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Fichier PDF</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Date soumission</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Note /20</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 text-gray-500">#{s.id}</td>
                                    <td className="py-3 px-4 font-semibold text-gray-800">
                                        {s.etudiant ? `${s.etudiant.prenom} ${s.etudiant.nom}` : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {s.examen ? s.examen.titre : '—'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {s.reponsePdf && (
                                            <span className="inline-flex items-center gap-1 text-purple-700 font-medium text-sm">
                                                📄 {s.reponsePdf}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-gray-500 text-sm">
                                        {s.dateSoumission ? new Date(s.dateSoumission).toLocaleString() : '—'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getNoteColor(s.note)}`}>
                                            {s.note !== null && s.note !== undefined ? Number(s.note).toFixed(1) : 'En attente'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(s)} className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            ✏️ {t('common.edit')}
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            🗑️ {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="7" className="py-8 text-center text-gray-400">Aucune soumission trouvée</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageSoumissions;
