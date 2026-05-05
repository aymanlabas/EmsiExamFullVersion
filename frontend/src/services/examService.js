import api from './api';

export const getExams = async () => {
    const response = await api.get('/exams');
    return response.data;
};

export const getExamById = async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
};

export const submitExam = async (examId, answers) => {
    const response = await api.post('/submissions', { examId, answers });
    return response.data;
};

export const getResults = async (userId) => {
    const response = await api.get(`/results/${userId}`);
    return response.data;
};
