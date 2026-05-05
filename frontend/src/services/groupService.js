import api from './api';

// ── Groupes ───────────────────────────────────────────────────────────────────
export const getGroupes = () => api.get('/groupes').then(r => r.data);
export const getGroupeById = (id) => api.get(`/groupes/${id}`).then(r => r.data);
export const getGroupesByProfesseur = (professeurId) => api.get(`/groupes/professeur/${professeurId}`).then(r => r.data);
export const createGroupe = (data) => api.post('/groupes', data).then(r => r.data);
export const updateGroupe = (id, data) => api.put(`/groupes/${id}`, data).then(r => r.data);
export const deleteGroupe = (id) => api.delete(`/groupes/${id}`);
