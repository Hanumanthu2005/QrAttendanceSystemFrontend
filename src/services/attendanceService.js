import api from "./api";

export const markAttendance = async (qrToken) => {
    const response = await api.post("/faculty/attendance", {
        qrToken
    });

    return response.data;
};