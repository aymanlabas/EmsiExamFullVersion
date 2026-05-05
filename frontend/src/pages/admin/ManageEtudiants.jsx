import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getEtudiants, createEtudiant, updateEtudiant, deleteEtudiant } from '../../services/etudiantService';
import { getGroupes } from '../../services/groupService';

const EMPTY_FORM = { prenom: '', nom: '', email: '', group: null, password: 'emsi' };

const ManageEtudiants = () => {
    const { t } = useTranslation();
    const [etudiants, setEtudiants] = useState([]);
    const [groupes, setGroupes] = useState([]);
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
            const [etudiantsData, groupesData] = await Promise.all([getEtudiants(), getGroupes()]);
            setEtudiants(etudiantsData);
            setGroupes(groupesData);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async () => {
        if (!form.prenom || !form.nom || !form.email || !form.group) return;
        setSaving(true);
        try {
            const payload = {
                prenom: form.prenom,
                nom: form.nom,
                email: form.email,
                password: form.password || 'emsi',
                group: form.group ? { id: Number(form.group) } : null,
            };
            if (editingId) {
                await updateEtudiant(editingId, payload);
            } else {
                await createEtudiant(payload);
            }
            await fetchData();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (etudiant) => {
        setForm({
            prenom: etudiant.prenom || '',
            nom: etudiant.nom || '',
            email: etudiant.email || '',
            password: etudiant.password || 'emsi',
            group: etudiant.group ? etudiant.group.id : '',
        });
        setEditingId(etudiant.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return;
        try {
            await deleteEtudiant(id);
            setEtudiants(etudiants.filter(e => e.id !== id));
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
                <h1 className="text-3xl font-bold text-gray-800">{t('navbar.students')}</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                    {showForm ? `✕ ${t('common.close')}` : `➕ ${t('common.add')} ${t('navbar.students')}`}
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
                        {editingId ? t('common.edit') : t('common.add')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
                            <input
                                type="text" value={form.prenom}
                                onChange={e => setForm({ ...form, prenom: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
                            <input
                                type="text" value={form.nom}
                                onChange={e => setForm({ ...form, nom: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe <span className="text-red-500">*</span></label>
                            <input
                                type="text" value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Groupe / Classe <span className="text-red-500">*</span></label>
                            <select
                                value={form.group}
                                onChange={e => setForm({ ...form, group: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            >
                                <option value="">-- Sélectionner --</option>
                                {groupes.map(g => (
                                    <option key={g.id} value={g.id}>{g.nameClass}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded font-semibold transition">
                            {saving ? '⏳ Sauvegarde...' : (editingId ? t('common.update') : t('common.add'))}
                        </button>
                        <button onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold transition">
                            {t('common.cancel')}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                {loading ? (
                    <div className="py-12 text-center text-gray-400">⏳ Chargement...</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Prénom</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Nom</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Mot de passe</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Groupe</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {etudiants.map(e => (
                                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 text-gray-500">#{e.id}</td>
                                    <td className="py-3 px-4 font-semibold text-gray-800">{e.prenom}</td>
                                    <td className="py-3 px-4 text-gray-700">{e.nom}</td>
                                    <td className="py-3 px-4 text-gray-600">{e.email}</td>
                                    <td className="py-3 px-4 font-mono text-sm tracking-wider text-purple-700 bg-purple-50 px-2 py-1 rounded inline-block mt-2">
                                        {e.password || 'emsi'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {e.group ? (
                                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                                                🏫 {e.group.nameClass}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Non assigné</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(e)} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            ✏️ {t('common.edit')}
                                        </button>
                                        <button onClick={() => handleDelete(e.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            🗑️ {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {etudiants.length === 0 && (
                                <tr><td colSpan="6" className="py-8 text-center text-gray-500">Aucun étudiant trouvé</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageEtudiants;
