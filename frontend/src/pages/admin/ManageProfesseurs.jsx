import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getProfesseurs, createProfesseur, updateProfesseur, deleteProfesseur } from '../../services/professeurService';

const EMPTY_FORM = { prenom: '', nom: '', email: '', password: 'emsi' };

const ManageProfesseurs = () => {
    const { t } = useTranslation();
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
            const data = await getProfesseurs();
            setProfesseurs(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async () => {
        if (!form.prenom || !form.nom || !form.email) return;
        setSaving(true);
        try {
            const payload = { ...form, password: form.password || 'emsi' };
            if (editingId) {
                await updateProfesseur(editingId, payload);
            } else {
                await createProfesseur(payload);
            }
            await fetchData();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (prof) => {
        setForm({
            prenom: prof.prenom || '',
            nom: prof.nom || '',
            email: prof.email || '',
            password: prof.password || 'emsi',
        });
        setEditingId(prof.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) return;
        try {
            await deleteProfesseur(id);
            setProfesseurs(professeurs.filter(p => p.id !== id));
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
                <h1 className="text-3xl font-bold text-gray-800">{t('navbar.professors')}</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                    {showForm ? `✕ ${t('common.close')}` : `➕ ${t('common.add')} ${t('navbar.professors')}`}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
                            <input type="text" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
                            <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe <span className="text-red-500">*</span></label>
                            <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSave} disabled={saving} className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-6 py-2 rounded font-semibold transition">
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
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professeurs.map(p => (
                                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 text-gray-500">#{p.id}</td>
                                    <td className="py-3 px-4 font-semibold text-gray-800">{p.prenom}</td>
                                    <td className="py-3 px-4 text-gray-700">{p.nom}</td>
                                    <td className="py-3 px-4 text-gray-600">{p.email}</td>
                                    <td className="py-3 px-4 font-mono text-sm tracking-wider text-yellow-700 bg-yellow-50 px-2 py-1 rounded inline-block mt-2">
                                        {p.password || 'emsi'}
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(p)} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            ✏️ {t('common.edit')}
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-semibold transition">
                                            🗑️ {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {professeurs.length === 0 && (
                                <tr><td colSpan="5" className="py-8 text-center text-gray-500">Aucun professeur trouvé</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageProfesseurs;
