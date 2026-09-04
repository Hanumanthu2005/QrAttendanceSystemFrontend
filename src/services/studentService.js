import api from "./api";

export const getStudentAttendanceSummary = async () => {
    const response = await api.get("/student/attendance/summary");
    return response.data;
};

export const getStudentAttendance = async () => {
    const response = await api.get("/student/attendance");
    return response.data;
};

export const getStudentAttendanceByDateRange = async (
    startDate,
    endDate
) => {
    const response = await api.get("/student/attendance", {
        params: {
            startDate,
            endDate
        }
    });

    return response.data;
};

export const getStudentQr = async () => {
    const response = await api.get("/student/qr", {
        responseType: "blob"
    });

    return response.data;
};

export const getStudentAttendanceSummaryByDateRange = async (
    startDate,
    endDate
) => {
    const response = await api.get(
        "/student/attendance/summary",
        {
            params: {
                startDate,
                endDate
            }
        }
    );

    return response.data;
};