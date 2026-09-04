import api from "./api";

export const getFacultyAttendanceSummary = async () => {
    const response = await api.get("/faculty/attendance/summary");
    return response.data;
};

export const getFacultyAttendanceSummaryByDateRange = async (
    startDate,
    endDate
) => {
    const response = await api.get("/faculty/attendance/summary", {
        params: {
            startDate,
            endDate
        }
    });

    return response.data;
};

export const getFacultySessions = async () => {
    const response = await api.get("/faculty/sessions");
    return response.data;
};

export const getFacultyAttendance = async () => {
    const response = await api.get("/faculty/attendance");
    return response.data;
};

export const getFacultyAttendanceByDateRange = async (
    startDate,
    endDate
) => {
    const response = await api.get("/faculty/attendance", {
        params: {
            startDate,
            endDate
        }
    });

    return response.data;
};