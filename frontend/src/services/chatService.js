import api from './api';

export const createSession = async (userId) => {
    const response = await api.post(`/chat/session?userId=${userId}`);
    return response.data;
};

export const getUserSessions = async (userId) => {
    const response = await api.get(`/chat/history/${userId}`);
    return response.data;
};

export const getSessionMessages = async (sessionId) => {
    const response = await api.get(`/chat/session/${sessionId}`);
    return response.data;
};

export const sendMessage = async (sessionId, model, text, imageFile) => {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('model', model);
    if (text) formData.append('text', text);
    if (imageFile) formData.append('image', imageFile);

    const response = await api.post('/chat/send', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
