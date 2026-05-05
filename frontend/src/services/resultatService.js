import api from './api';

// ── Resultats ─────────────────────────────────────────────────────────────────
export const getResultats = () => api.get('/resultats').then(r => r.data);
export const getResultatById = (id) => api.get(`/resultats/${id}`).then(r => r.data);
export const getResultatsByEtudiant = (etudiantId) => api.get(`/resultats/etudiant/${etudiantId}`).then(r => r.data);
export const getResultatsByExamen = (examenId) => api.get(`/resultats/examen/${examenId}`).then(r => r.data);
export const getResultatsByStatut = (statut) => api.get(`/resultats/statut/${statut}`).then(r => r.data);
export const createResultat = (data) => api.post('/resultats', data).then(r => r.data);
export const updateResultat = (id, data) => api.put(`/resultats/${id}`, data).then(r => r.data);
export const deleteResultat = (id) => api.delete(`/resultats/${id}`);
