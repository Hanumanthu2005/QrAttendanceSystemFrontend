import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Clock,
    Eye,
    RefreshCw
} from "lucide-react";

import { getFacultySessions } from "../../services/facultyService";

export default function FacultySessions() {

    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadSessions = async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getFacultySessions();

            setSessions(data || []);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load sessions"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const formatTime = (time) => {

        if (!time) {
            return "—";
        }

        return new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const viewAttendance = (sessionId) => {

        navigate(
            `/faculty/session/${sessionId}/attendance`
        );

    };

    if (loading) {

        return (
            <div className="loading-page">
                <p>Loading sessions...</p>
            </div>
        );

    }

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>

                    <span className="eyebrow">
                        FACULTY
                    </span>

                    <h1>
                        Session History
                    </h1>

                    <p>
                        View all attendance sessions created by you.
                    </p>

                </div>

                <button
                    className="secondary-button"
                    onClick={() => loadSessions(true)}
                    disabled={refreshing}
                >

                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "refresh-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}

                </button>

            </div>


            {/* ================= ERROR ================= */}

            {error && (

                <div className="alert error">
                    {error}
                </div>

            )}


            {/* ================= SUMMARY ================= */}

            <div className="session-history-summary">

                <div className="history-summary-card">

                    <CalendarDays size={22} />

                    <div>

                        <span>
                            Total Sessions
                        </span>

                        <strong>
                            {sessions.length}
                        </strong>

                    </div>

                </div>


                <div className="history-summary-card">

                    <Clock size={22} />

                    <div>

                        <span>
                            Active Sessions
                        </span>

                        <strong>
                            {
                                sessions.filter(
                                    session =>
                                        session.status === "ACTIVE"
                                ).length
                            }
                        </strong>

                    </div>

                </div>


                <div className="history-summary-card">

                    <Clock size={22} />

                    <div>

                        <span>
                            Closed Sessions
                        </span>

                        <strong>
                            {
                                sessions.filter(
                                    session =>
                                        session.status === "CLOSED"
                                ).length
                            }
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= SESSION TABLE ================= */}

            <div className="sessions-list-card">

                <div className="table-header">

                    <div>

                        <h2>
                            All Sessions
                        </h2>

                        <p>
                            Your attendance session history.
                        </p>

                    </div>

                </div>


                {sessions.length === 0 ? (

                    <div className="table-empty">

                        <CalendarDays size={42} />

                        <h3>
                            No sessions found
                        </h3>

                        <p>
                            You haven't created any attendance sessions yet.
                        </p>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/faculty/session")
                            }
                        >
                            Create Session
                        </button>

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
                                        Date
                                    </th>

                                    <th>
                                        Start Time
                                    </th>

                                    <th>
                                        End Time
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

                                {sessions.map((session) => (

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
                                            {formatTime(
                                                session.startTime
                                            )}
                                        </td>


                                        <td>
                                            {formatTime(
                                                session.endTime
                                            )}
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
                                                    viewAttendance(
                                                        session.id
                                                    )
                                                }
                                            >

                                                <Eye size={16} />

                                                View Attendance

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}