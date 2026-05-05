import api from './api';

// ── Etudiants ─────────────────────────────────────────────────────────────────
export const getEtudiants = () => api.get('/etudiants').then(r => r.data);
export const getEtudiantById = (id) => api.get(`/etudiants/${id}`).then(r => r.data);
export const getEtudiantsByGroupe = (groupId) => api.get(`/etudiants/groupe/${groupId}`).then(r => r.data);
export const searchEtudiants = (q) => api.get('/etudiants/search', { params: { q } }).then(r => r.data);
export const createEtudiant = (data) => api.post('/etudiants', data).then(r => r.data);
export const updateEtudiant = (id, data) => api.put(`/etudiants/${id}`, data).then(r => r.data);
export const deleteEtudiant = (id) => api.delete(`/etudiants/${id}`);
