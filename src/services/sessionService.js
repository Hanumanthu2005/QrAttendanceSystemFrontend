import api from "./api";

export const createSession = async () => {
    const response = await api.post("/faculty/session");
    return response.data;
};

export const getActiveSession = async () => {
    const response = await api.get("/faculty/session");
    return response.data;
};

export const closeSession = async (sessionId) => {
    const response = await api.post(
        `/faculty/session/${sessionId}/close`
    );

    return response.data;
};

export const getAllSessions = async () => {
    const response = await api.get("/faculty/sessions");
    return response.data;
};

export const getSessionAttendance = async (sessionId) => {
    const response = await api.get(
        `/faculty/session/${sessionId}/attendance`
    );

    return response.data;
};