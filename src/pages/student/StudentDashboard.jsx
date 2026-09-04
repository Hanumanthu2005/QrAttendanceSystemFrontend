import React, { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle,
    XCircle,
    Percent,
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getStudentAttendanceSummary,
    getStudentAttendance
} from "../../services/studentService";

export default function StudentDashboard() {

    const navigate = useNavigate();

    const [summary, setSummary] = useState(null);
    const [recentAttendance, setRecentAttendance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                summaryData,
                attendanceData
            ] = await Promise.all([
                getStudentAttendanceSummary(),
                getStudentAttendance()
            ]);

            setSummary(summaryData);

            /*
             * Show the latest attendance records first.
             */
            const recent = [...(attendanceData || [])]
                .sort(
                    (a, b) =>
                        new Date(b.attendanceTime) -
                        new Date(a.attendanceTime)
                )
                .slice(0, 5);

            setRecentAttendance(recent);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load student dashboard"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return (
            <div className="alert error">
                {error}
            </div>
        );
    }

    if (!summary) {
        return null;
    }

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <div>

                    <span className="eyebrow">
                        STUDENT DASHBOARD
                    </span>

                    <h1>
                        Welcome back, {summary.name}
                    </h1>

                    <p>
                        Roll Number: {summary.roll}
                    </p>

                </div>

            </div>


            {/* ================= STAT CARDS ================= */}

            <div className="dashboard-stats">

                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <Percent size={22} />
                    </div>

                    <div>

                        <span>
                            Attendance
                        </span>

                        <strong>
                            {summary.attendancePercentage.toFixed(1)}%
                        </strong>

                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <CalendarDays size={22} />
                    </div>

                    <div>

                        <span>
                            Total Sessions
                        </span>

                        <strong>
                            {summary.totalSessions}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <CheckCircle size={22} />
                    </div>

                    <div>

                        <span>
                            Present
                        </span>

                        <strong>
                            {summary.presentSessions}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <XCircle size={22} />
                    </div>

                    <div>

                        <span>
                            Absent
                        </span>

                        <strong>
                            {summary.absentSessions}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= ATTENDANCE OVERVIEW ================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Attendance Overview
                        </h2>

                        <p>
                            Your attendance performance.
                        </p>

                    </div>

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate("/student/attendance")
                        }
                    >
                        View history
                        <ArrowRight size={16} />
                    </button>

                </div>


                <div className="student-attendance-overview">

                    <div className="attendance-percentage">

                        <div className="percentage-circle">

                            <strong>
                                {summary.attendancePercentage.toFixed(1)}%
                            </strong>

                            <span>
                                Attendance
                            </span>

                        </div>

                    </div>


                    <div className="attendance-breakdown">

                        <div className="breakdown-item">

                            <div className="breakdown-label">

                                <span className="present-indicator" />

                                Present

                            </div>

                            <strong>
                                {summary.presentSessions}
                            </strong>

                        </div>


                        <div className="breakdown-item">

                            <div className="breakdown-label">

                                <span className="absent-indicator" />

                                Absent

                            </div>

                            <strong>
                                {summary.absentSessions}
                            </strong>

                        </div>


                        <div className="breakdown-item">

                            <div className="breakdown-label">

                                <span className="total-indicator" />

                                Total Sessions

                            </div>

                            <strong>
                                {summary.totalSessions}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= RECENT ATTENDANCE ================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Recent Attendance
                        </h2>

                        <p>
                            Your latest attendance records.
                        </p>

                    </div>

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate("/student/attendance")
                        }
                    >
                        View all
                        <ArrowRight size={16} />
                    </button>

                </div>


                <div className="recent-sessions-card">

                    {recentAttendance.length === 0 ? (

                        <div className="table-empty">

                            <CalendarDays size={40} />

                            <h3>
                                No attendance records
                            </h3>

                            <p>
                                Your attendance records will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Time
                                        </th>

                                        <th>
                                            Faculty
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentAttendance.map(
                                        (attendance) => (

                                            <tr key={attendance.id}>

                                                <td>
                                                    {attendance.attendanceDate}
                                                </td>

                                                <td>

                                                    {attendance.attendanceTime
                                                        ? new Date(
                                                            attendance.attendanceTime
                                                        ).toLocaleTimeString()
                                                        : "—"}

                                                </td>

                                                <td>
                                                    {attendance.facultyId}
                                                </td>

                                                <td>

                                                    <span className="attendance-status present">

                                                        <CheckCircle size={16} />

                                                        {attendance.status}

                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}