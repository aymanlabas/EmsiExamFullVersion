import api from './api';

// ── Soumissions ───────────────────────────────────────────────────────────────
export const getSoumissions = () => api.get('/soumissions').then(r => r.data);
export const getSoumissionById = (id) => api.get(`/soumissions/${id}`).then(r => r.data);
export const getSoumissionsByEtudiant = (etudiantId) => api.get(`/soumissions/etudiant/${etudiantId}`).then(r => r.data);
export const getSoumissionsByExamen = (examenId) => api.get(`/soumissions/examen/${examenId}`).then(r => r.data);
export const createSoumission = (data) => api.post('/soumissions', data).then(r => r.data);
export const updateSoumission = (id, data) => api.put(`/soumissions/${id}`, data).then(r => r.data);
export const deleteSoumission = (id) => api.delete(`/soumissions/${id}`);
