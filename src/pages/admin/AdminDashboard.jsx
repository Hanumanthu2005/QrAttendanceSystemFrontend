import React, { useEffect, useState } from "react";
import {
    Users,
    GraduationCap,
    ClipboardCheck,
    CalendarDays,
    CheckCircle,
    XCircle,
    RefreshCw,
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getAllStudents,
    getAllFaculty,
    getAllAttendance,
    getAllSessions
} from "../../services/adminService";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                studentsData,
                facultyData,
                attendanceData,
                sessionsData
            ] = await Promise.all([
                getAllStudents(),
                getAllFaculty(),
                getAllAttendance(),
                getAllSessions()
            ]);

            setStudents(studentsData || []);
            setFaculty(facultyData || []);
            setAttendance(attendanceData || []);
            setSessions(sessionsData || []);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load admin dashboard"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {

        return (
            <div className="loading-page">
                <p>Loading admin dashboard...</p>
            </div>
        );

    }

    if (error) {

        return (
            <div>

                <div className="page-header">

                    <div>
                        <span className="eyebrow">
                            ADMIN
                        </span>

                        <h1>
                            Admin Dashboard
                        </h1>
                    </div>

                    <button
                        className="secondary-button"
                        onClick={loadDashboard}
                    >
                        <RefreshCw size={17} />
                        Retry
                    </button>

                </div>

                <div className="alert error">
                    {error}
                </div>

            </div>
        );
    }

    const presentCount = attendance.filter(
        item => item.status === "PRESENT"
    ).length;

    const absentCount = attendance.filter(
        item => item.status === "ABSENT"
    ).length;

    const activeSessions = sessions.filter(
        session => session.status === "ACTIVE"
    ).length;

    const closedSessions = sessions.filter(
        session => session.status === "CLOSED"
    ).length;

    /*
     * Latest attendance records.
     */
    const recentAttendance = [...attendance]
        .sort(
            (a, b) =>
                new Date(b.attendanceTime || 0) -
                new Date(a.attendanceTime || 0)
        )
        .slice(0, 5);

    /*
     * Latest sessions.
     */
    const recentSessions = [...sessions]
        .sort(
            (a, b) =>
                new Date(b.startTime || 0) -
                new Date(a.startTime || 0)
        )
        .slice(0, 5);

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>

                    <span className="eyebrow">
                        ADMIN
                    </span>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Overview of students, faculty, sessions and attendance.
                    </p>

                </div>

                <button
                    className="secondary-button"
                    onClick={loadDashboard}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>


            {/* ================= STAT CARDS ================= */}

            <div className="dashboard-stats">

                {/* Students */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <GraduationCap size={22} />
                    </div>

                    <div>

                        <span>
                            Total Students
                        </span>

                        <strong>
                            {students.length}
                        </strong>

                    </div>

                </div>


                {/* Faculty */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <Users size={22} />
                    </div>

                    <div>

                        <span>
                            Total Faculty
                        </span>

                        <strong>
                            {faculty.length}
                        </strong>

                    </div>

                </div>


                {/* Sessions */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <CalendarDays size={22} />
                    </div>

                    <div>

                        <span>
                            Total Sessions
                        </span>

                        <strong>
                            {sessions.length}
                        </strong>

                    </div>

                </div>


                {/* Attendance */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <ClipboardCheck size={22} />
                    </div>

                    <div>

                        <span>
                            Attendance Records
                        </span>

                        <strong>
                            {attendance.length}
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
                            Overall attendance activity in the system.
                        </p>

                    </div>

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate("/admin/attendance")
                        }
                    >
                        View attendance
                        <ArrowRight size={16} />
                    </button>

                </div>


                <div className="admin-overview-grid">

                    <div className="admin-overview-card">

                        <div className="admin-overview-icon present">
                            <CheckCircle size={23} />
                        </div>

                        <div>

                            <span>
                                Present Records
                            </span>

                            <strong>
                                {presentCount}
                            </strong>

                        </div>

                    </div>


                    <div className="admin-overview-card">

                        <div className="admin-overview-icon absent">
                            <XCircle size={23} />
                        </div>

                        <div>

                            <span>
                                Absent Records
                            </span>

                            <strong>
                                {absentCount}
                            </strong>

                        </div>

                    </div>


                    <div className="admin-overview-card">

                        <div className="admin-overview-icon active">
                            <CalendarDays size={23} />
                        </div>

                        <div>

                            <span>
                                Active Sessions
                            </span>

                            <strong>
                                {activeSessions}
                            </strong>

                        </div>

                    </div>


                    <div className="admin-overview-card">

                        <div className="admin-overview-icon closed">
                            <ClipboardCheck size={23} />
                        </div>

                        <div>

                            <span>
                                Closed Sessions
                            </span>

                            <strong>
                                {closedSessions}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= QUICK ACCESS ================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Quick Access
                        </h2>

                        <p>
                            Manage the main parts of the attendance system.
                        </p>

                    </div>

                </div>


                <div className="admin-quick-grid">

                    <button
                        className="admin-quick-card"
                        onClick={() =>
                            navigate("/admin/student")
                        }
                    >

                        <GraduationCap size={24} />

                        <div>

                            <strong>
                                Students
                            </strong>

                            <span>
                                Manage students
                            </span>

                        </div>

                        <ArrowRight size={18} />

                    </button>


                    <button
                        className="admin-quick-card"
                        onClick={() =>
                            navigate("/admin/faculty")
                        }
                    >

                        <Users size={24} />

                        <div>

                            <strong>
                                Faculty
                            </strong>

                            <span>
                                Manage faculty
                            </span>

                        </div>

                        <ArrowRight size={18} />

                    </button>


                    <button
                        className="admin-quick-card"
                        onClick={() =>
                            navigate("/admin/attendance")
                        }
                    >

                        <ClipboardCheck size={24} />

                        <div>

                            <strong>
                                Attendance
                            </strong>

                            <span>
                                View attendance records
                            </span>

                        </div>

                        <ArrowRight size={18} />

                    </button>


                    <button
                        className="admin-quick-card"
                        onClick={() =>
                            navigate("/admin/sessions")
                        }
                    >

                        <CalendarDays size={24} />

                        <div>

                            <strong>
                                Sessions
                            </strong>

                            <span>
                                View attendance sessions
                            </span>

                        </div>

                        <ArrowRight size={18} />

                    </button>

                </div>

            </div>


            {/* ================= RECENT SESSIONS ================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Recent Sessions
                        </h2>

                        <p>
                            Latest attendance sessions.
                        </p>

                    </div>

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate("/admin/sessions")
                        }
                    >
                        View all
                        <ArrowRight size={16} />
                    </button>

                </div>


                <div className="attendance-table-card">

                    {recentSessions.length === 0 ? (

                        <div className="table-empty">

                            <CalendarDays size={40} />

                            <h3>
                                No sessions
                            </h3>

                            <p>
                                No attendance sessions have been created yet.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Session
                                        </th>

                                        <th>
                                            Faculty
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Start Time
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentSessions.map(session => (

                                        <tr key={session.id}>

                                            <td>
                                                #{session.id}
                                            </td>

                                            <td>
                                                {session.facultyId}
                                            </td>

                                            <td>
                                                {session.date}
                                            </td>

                                            <td>
                                                {session.startTime
                                                    ? new Date(
                                                        session.startTime
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })
                                                    : "—"}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        session.status === "ACTIVE"
                                                            ? "status active"
                                                            : "status closed"
                                                    }
                                                >
                                                    {session.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

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
                            Latest attendance records across the system.
                        </p>

                    </div>

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate("/admin/attendance")
                        }
                    >
                        View all
                        <ArrowRight size={16} />
                    </button>

                </div>


                <div className="attendance-table-card">

                    {recentAttendance.length === 0 ? (

                        <div className="table-empty">

                            <ClipboardCheck size={40} />

                            <h3>
                                No attendance records
                            </h3>

                            <p>
                                Attendance records will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Roll Number
                                        </th>

                                        <th>
                                            Faculty
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentAttendance.map(item => (

                                        <tr key={item.id}>

                                            <td>
                                                {item.studentName}
                                            </td>

                                            <td>
                                                {item.studentRoll}
                                            </td>

                                            <td>
                                                {item.facultyId}
                                            </td>

                                            <td>
                                                {item.attendanceDate}
                                            </td>

                                            <td>

                                                {item.status === "PRESENT" ? (

                                                    <span className="attendance-status present">

                                                        <CheckCircle size={16} />

                                                        PRESENT

                                                    </span>

                                                ) : (

                                                    <span className="attendance-status absent">

                                                        <XCircle size={16} />

                                                        {item.status}

                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}