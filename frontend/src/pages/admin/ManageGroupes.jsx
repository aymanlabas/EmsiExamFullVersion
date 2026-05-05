import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getGroupes, createGroupe, updateGroupe, deleteGroupe } from '../../services/groupService';
import { getProfesseurs } from '../../services/professeurService';

const EMPTY_FORM = { nameClass: '', professeur: null };

const ManageGroupes = () => {
    const { t } = useTranslation();
    const [groupes, setGroupes] = useState([]);
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
            const [groupesData, professeursData] = await Promise.all([getGroupes(), getProfesseurs()]);
            setGroupes(groupesData);
            setProfesseurs(professeursData);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async () => {
        if (!form.nameClass) return;
        setSaving(true);
        try {
            const payload = {
                nameClass: form.nameClass,
                professeur: form.professeur ? { id: Number(form.professeur) } : null,
            };
            if (editingId) {
                await updateGroupe(editingId, payload);
            } else {
                await createGroupe(payload);
            }
            await fetchData();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (g) => {
        setForm({
            nameClass: g.nameClass || '',
            professeur: g.professeur ? g.professeur.id : '',
        });
        setEditingId(g.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce groupe ?')) return;
        try {
            await deleteGroupe(id);
            setGroupes(groupes.filter(g => g.id !== id));
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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Groupes / Classes</h1>
                    <p className="text-gray-500 text-sm mt-1">Gérez les classes et leurs professeurs responsables</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                    {showForm ? `✕ ${t('common.close')}` : '➕ Nouveau Groupe'}
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
                        {editingId ? 'Modifier le groupe' : 'Créer un groupe'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de la classe <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.nameClass}
                                onChange={e => setForm({ ...form, nameClass: e.target.value })}
                                placeholder="ex: INGE-INFO-3A"
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Professeur responsable</label>
                            <select
                                value={form.professeur}
                                onChange={e => setForm({ ...form, professeur: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            >
                                <option value="">-- Sélectionner --</option>
                                {professeurs.map(p => (
                                    <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSave} disabled={saving} className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white px-6 py-2 rounded font-semibold transition">
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
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">ID Classe</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Nom de la classe</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Professeur responsable</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupes.map(g => (
                                <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 text-gray-500">#{g.id}</td>
                                    <td className="py-3 px-4 font-semibold text-gray-800">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="text-lg">🏫</span> {g.nameClass}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {g.professeur ? `${g.professeur.prenom} ${g.professeur.nom}` : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(g)} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            ✏️ {t('common.edit')}
                                        </button>
                                        <button onClick={() => handleDelete(g.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            🗑️ {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {groupes.length === 0 && (
                                <tr><td colSpan="4" className="py-8 text-center text-gray-500">Aucun groupe trouvé</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageGroupes;
