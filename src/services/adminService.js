import api from "./api";


export const getAllFaculty = async () => {
    const response = await api.get("/admin/faculty");
    return response.data;
};

export const getAllAttendance = async () => {
    const response = await api.get("/admin/attendance");
    return response.data;
};

export const getAllSessions = async () => {
    const response = await api.get("/admin/sessions");
    return response.data;
};

export const getAttendanceByDateRange = async (
    startDate,
    endDate
) => {
    const response = await api.get("/admin/attendance", {
        params: {
            startDate,
            endDate
        }
    });

    return response.data;
};

import api from "./api";

// Get all students
export const getAllStudents = async () => {
  const response = await api.get("/admin/student");
  return response.data;
};

// Get student by ID
export const getStudentById = async (id) => {
  const response = await api.get(`/admin/student/${id}`);
  return response.data;
};

// Add student
export const createStudent = async (studentData) => {
  const response = await api.post("/admin/student", studentData);
  return response.data;
};

// Update student
export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/admin/student/${id}`, studentData);
  return response.data;
};

// Delete student
export const deleteStudent = async (id) => {
  const response = await api.delete(`/admin/student/${id}`);
  return response.data;
};
