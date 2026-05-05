import api from './api';

// ── Professeurs ───────────────────────────────────────────────────────────────
export const getProfesseurs = () => api.get('/professeurs').then(r => r.data);
export const getProfesseurById = (id) => api.get(`/professeurs/${id}`).then(r => r.data);
export const getProfesseurByEmail = (email) => api.get(`/professeurs/email/${email}`).then(r => r.data);
export const createProfesseur = (data) => api.post('/professeurs', data).then(r => r.data);
export const updateProfesseur = (id, data) => api.put(`/professeurs/${id}`, data).then(r => r.data);
export const deleteProfesseur = (id) => api.delete(`/professeurs/${id}`);
