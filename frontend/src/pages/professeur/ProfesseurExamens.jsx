import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { getExamensByProfesseur, createExamen, updateExamen, deleteExamen, uploadFile } from '../../services/examenService';
import { getGroupesByProfesseur } from '../../services/groupService';

const ProfesseurExamens = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [examens, setExamens] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ titre: '', fichierpdf: '', dateDebut: '', dateFin: '', duree: '', groupeId: '' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadExamens(user.id);
            loadGroups(user.id);
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const filename = await uploadFile(file);
            setForm({ ...form, fichierpdf: filename });
            setUploading(false);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Erreur lors de l'upload du fichier.");
            setUploading(false);
        }
    };

    const loadGroups = async (profId) => {
        try {
            const data = await getGroupesByProfesseur(profId);
            setGroups(data);
        } catch (error) {
            console.error("Error loading groups:", error);
        }
    };

    const loadExamens = async (profId) => {
        try {
            const data = await getExamensByProfesseur(profId);
            setExamens(data);
        } catch (error) {
            console.error("Error loading examens:", error);
        }
    };

    const handleSave = async () => {
        if (!form.titre || !form.dateDebut || !form.dateFin || !form.duree || !form.groupeId || !user?.id) {
            alert("Veuillez remplir tous les champs, y compris le groupe.");
            return;
        }

        const payload = {
            titre: form.titre,
            fichierPdf: form.fichierpdf,
            dateDebut: form.dateDebut,
            dateFin: form.dateFin,
            duree: parseInt(form.duree),
            professeur: { id: user.id },
            groupe: { id: form.groupeId }
        };

        try {
            if (editingId) {
                const updated = await updateExamen(editingId, payload);
                setExamens(examens.map(ex => ex.id === editingId ? updated : ex));
            } else {
                const created = await createExamen(payload);
                setExamens([...examens, created]);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving examen:", error);
            alert("Erreur lors de l'enregistrement de l'examen.");
        }
    };

    const handleEdit = (ex) => {
        setForm({
            titre: ex.titre || '',
            fichierpdf: ex.fichierPdf || '',
            dateDebut: ex.dateDebut || '',
            dateFin: ex.dateFin || '',
            duree: ex.duree || '',
            groupeId: ex.groupe?.id || ''
        });
        setEditingId(ex.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Supprimer cet examen ?')) {
            try {
                await deleteExamen(id);
                setExamens(examens.filter(ex => ex.id !== id));
            } catch (error) {
                console.error("Error deleting examen:", error);
                alert("Erreur lors de la suppression.");
            }
        }
    };

    const resetForm = () => {
        setForm({ titre: '', fichierpdf: '', dateDebut: '', dateFin: '', duree: '', groupeId: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t('navbar.my_exams')}</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                    {showForm ? `✕ ${t('common.close')}` : `➕ ${t('common.add')}`}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        {editingId ? t('common.edit') : t('common.add')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Titre</label>
                            <input type="text" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fichier PDF {uploading && <span className="text-xs text-green-600 animate-pulse">(Chargement...)</span>}</label>
                            <input type="file" accept=".pdf" onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                            {form.fichierpdf && <p className="text-xs text-green-700 mt-1">✓ {form.fichierpdf}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Durée (min)</label>
                            <input type="number" value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date début</label>
                            <input type="datetime-local" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date fin</label>
                            <input type="datetime-local" value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Groupe</label>
                            <select
                                value={form.groupeId}
                                onChange={e => setForm({ ...form, groupeId: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            >
                                <option value="">Sélectionnez un groupe</option>
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.nameClass}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSave} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded font-semibold transition">
                            {editingId ? t('common.update') : t('common.add')}
                        </button>
                        <button onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold transition">
                            {t('common.cancel')}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examens.map(ex => (
                    <div key={ex.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h2 className="text-xl font-bold text-green-800 mb-2">{ex.titre}</h2>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p>📄 {ex.fichierPdf || 'Pas de fichier'}</p>
                            <p>👥 Groupe: <span className="font-semibold text-green-700">{ex.groupe?.nameClass || 'N/A'}</span></p>
                            <p>⏱ Durée: {ex.duree} min</p>
                            <p>📅 {ex.dateDebut ? new Date(ex.dateDebut).toLocaleString() : ''} → {ex.dateFin ? new Date(ex.dateFin).toLocaleString() : ''}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(ex)} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-semibold transition">
                                ✏️ {t('common.edit')}
                            </button>
                            <button onClick={() => handleDelete(ex.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-semibold transition">
                                🗑️ {t('common.delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfesseurExamens;
