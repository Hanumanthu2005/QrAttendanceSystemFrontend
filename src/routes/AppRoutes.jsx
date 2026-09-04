import React from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/admin/AdminDashboard";
import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";

import FacultySession from "../pages/faculty/FacultySession";
import SessionAttendance from "../pages/faculty/SesssionAttendance";
import FacultyScanner from "../pages/faculty/FacultyScanner";
import FacultySessions from "../pages/faculty/FacultySessions";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentQR from "../pages/student/StudentQR";
import FacultyAttendance from "../pages/faculty/FacultyAttendance";
import FacultyReports from "../pages/faculty/FacultyReports";
import StudentSummary from "../pages/student/StudentSummary";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../common/Layout";

export default function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* ================= ADMIN ================= */}

                <Route
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/student"
                        element={<AdminStudents />}
                    />
                </Route>


                {/* ================= FACULTY ================= */}

                <Route
                    element={
                        <ProtectedRoute allowedRoles={["FACULTY"]}>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/faculty/dashboard"
                        element={<FacultyDashboard />}
                    />

                    <Route
                        path="/faculty/session"
                        element={<FacultySession />}
                    />

                    <Route
                        path="/faculty/session/:sessionId/attendance"
                        element={<SessionAttendance />}
                    />

                    <Route
                        path="/faculty/scan"
                        element={<FacultyScanner />}
                    />

                    <Route
                        path="/faculty/sessions"
                        element={<FacultySessions />}
                    />

                    <Route
                        path="/faculty/attendance"
                        element={<FacultyAttendance />}
                    />

                    <Route
                        path="/faculty/reports"
                        element={<FacultyReports />}
                    />
                </Route>


                {/* ================= STUDENT ================= */}

                <Route
                    element={
                        <ProtectedRoute allowedRoles={["STUDENT"]}>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/student/dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/student/attendance"
                        element={<StudentAttendance />}
                    />

                    <Route
                        path="/student/qr"
                        element={<StudentQR />}
                    />

                    <Route
                        path="/student/summary"
                        element={<StudentSummary />}
                    />
                </Route>


                {/* ================= DEFAULT ================= */}

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}