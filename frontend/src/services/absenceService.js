import api from './api';

// ── Absences ──────────────────────────────────────────────────────────────────
export const getAbsences = () => api.get('/absences').then(r => r.data);
export const getAbsenceById = (id) => api.get(`/absences/${id}`).then(r => r.data);
export const getAbsencesByEtudiant = (etudiantId) => api.get(`/absences/etudiant/${etudiantId}`).then(r => r.data);
export const getAbsencesByExamen = (examenId) => api.get(`/absences/examen/${examenId}`).then(r => r.data);
export const createAbsence = (data) => api.post('/absences', data).then(r => r.data);
export const updateAbsence = (id, data) => api.put(`/absences/${id}`, data).then(r => r.data);
export const deleteAbsence = (id) => api.delete(`/absences/${id}`);
