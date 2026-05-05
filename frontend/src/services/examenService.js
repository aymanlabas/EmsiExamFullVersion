import api from './api';

// ── Examens ──────────────────────────────────────────────────────────────────
export const getExamens = () => api.get('/examens').then(r => r.data);
export const getExamenById = (id) => api.get(`/examens/${id}`).then(r => r.data);
export const getExamensByProfesseur = (profId) => api.get(`/examens/professeur/${profId}`).then(r => r.data);
export const getExamensByGroupe = (groupeId) => api.get(`/examens/groupe/${groupeId}`).then(r => r.data);
export const searchExamens = (titre) => api.get('/examens/search', { params: { titre } }).then(r => r.data);
export const createExamen = (data) => api.post('/examens', data).then(r => r.data);
export const updateExamen = (id, data) => api.put(`/examens/${id}`, data).then(r => r.data);
export const deleteExamen = (id) => api.delete(`/examens/${id}`);

// ── Files ────────────────────────────────────────────────────────────────────
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
};
