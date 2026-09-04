import React, { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle,
    Clock,
    QrCode,
    Users,
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getFacultyAttendanceSummary,
    getFacultySessions
} from "../../services/facultyService";

export default function FacultyDashboard() {

    const navigate = useNavigate();

    const [summary, setSummary] = useState(null);
    const [sessions, setSessions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [summaryData, sessionData] =
                await Promise.all([
                    getFacultyAttendanceSummary(),
                    getFacultySessions()
                ]);

            setSummary(summaryData);
            setSessions(sessionData);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load faculty dashboard"
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

    /*
     * The backend returns sessions.
     *
     * We display the newest session first.
     */
    const recentSessions = [...sessions]
        .sort(
            (a, b) =>
                new Date(b.startTime) -
                new Date(a.startTime)
        )
        .slice(0, 5);

    const activeSession = sessions.find(
        session => session.status === "ACTIVE"
    );

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <div>

                    <span className="eyebrow">
                        FACULTY DASHBOARD
                    </span>

                    <h1>
                        Welcome back, {summary.facultyName}
                    </h1>

                    <p>
                        Here's an overview of your attendance activity.
                    </p>

                </div>

            </div>


            {/* ================= STAT CARDS ================= */}

            <div className="dashboard-stats">

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
                            Attendance Records
                        </span>

                        <strong>
                            {summary.totalAttendanceRecords}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <Users size={22} />
                    </div>

                    <div>

                        <span>
                            Students
                        </span>

                        <strong>
                            {summary.studentAttendanceSummaries?.length || 0}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <Clock size={22} />
                    </div>

                    <div>

                        <span>
                            Active Session
                        </span>

                        <strong>
                            {activeSession ? "Active" : "None"}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= ACTIVE SESSION ================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Today's Session
                        </h2>

                        <p>
                            Manage your current attendance session.
                        </p>

                    </div>

                </div>


                {activeSession ? (

                    <div className="active-session-card">

                        <div className="active-session-info">

                            <div className="active-session-title">

                                <span className="live-dot" />

                                <div>

                                    <strong>
                                        Session #{activeSession.id}
                                    </strong>

                                    <span>
                                        Attendance session is active
                                    </span>

                                </div>

                            </div>


                            <div className="active-session-time">

                                <div>

                                    <span>
                                        Started
                                    </span>

                                    <strong>
                                        {new Date(
                                            activeSession.startTime
                                        ).toLocaleTimeString()}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Ends
                                    </span>

                                    <strong>
                                        {new Date(
                                            activeSession.endTime
                                        ).toLocaleTimeString()}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <div className="active-session-actions">

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/faculty/scan")
                                }
                            >
                                <QrCode size={18} />
                                Scan QR
                            </button>

                            <button
                                className="secondary-button"
                                onClick={() =>
                                    navigate(
                                        `/faculty/session/${activeSession.id}/attendance`
                                    )
                                }
                            >
                                <Users size={18} />
                                View Attendance
                            </button>

                        </div>

                    </div>

                ) : (

                    <div className="no-active-session">

                        <Clock size={28} />

                        <div>

                            <strong>
                                No active session
                            </strong>

                            <span>
                                Start a session to begin taking attendance.
                            </span>

                        </div>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/faculty/session")
                            }
                        >
                            Create Session
                        </button>

                    </div>

                )}

            </div>


            {/* ================= RECENT SESSIONS ================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Recent Sessions
                        </h2>

                        <p>
                            Your latest attendance sessions.
                        </p>

                    </div>

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate("/faculty/sessions")
                        }
                    >
                        View all
                        <ArrowRight size={16} />
                    </button>

                </div>


                {recentSessions.length === 0 ? (

                    <div className="table-empty">

                        <CalendarDays size={40} />

                        <h3>
                            No sessions yet
                        </h3>

                        <p>
                            Create your first attendance session.
                        </p>

                    </div>

                ) : (

                    <div className="recent-sessions-card">

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Session
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Time
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentSessions.map(
                                        (session) => (

                                            <tr key={session.id}>

                                                <td>
                                                    <strong>
                                                        #{session.id}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {session.date}
                                                </td>

                                                <td>

                                                    {new Date(
                                                        session.startTime
                                                    ).toLocaleTimeString()}
                                                    {" - "}
                                                    {new Date(
                                                        session.endTime
                                                    ).toLocaleTimeString()}

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

                                                <td>

                                                    <button
                                                        className="table-action"
                                                        onClick={() =>
                                                            navigate(
                                                                `/faculty/session/${session.id}/attendance`
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}