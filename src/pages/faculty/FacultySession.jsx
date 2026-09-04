import React, { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    Play,
    Square,
    Users
} from "lucide-react";

import {
    closeSession,
    createSession,
    getActiveSession
} from "../../services/sessionService";
import { useNavigate } from "react-router-dom";

function getRemainingTime(endTime) {
    const difference =
        new Date(endTime).getTime() - Date.now();

    if (difference <= 0) {
        return {
            total: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
    }

    const totalSeconds = Math.floor(difference / 1000);

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    return {
        total: difference,
        hours,
        minutes,
        seconds
    };
}

function formatTime(value) {
    return String(value).padStart(2, "0");
}

export default function FacultySession() {

    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [remaining, setRemaining] = useState(null);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [closing, setClosing] = useState(false);

    const [error, setError] = useState("");

    const loadActiveSession = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getActiveSession();

            setSession(data);

            if (data.status === "ACTIVE") {
                setRemaining(
                    getRemainingTime(data.endTime)
                );
            }

        } catch (error) {

            if (error.response?.status === 404) {

                setSession(null);
                setRemaining(null);

            } else {

                setError(
                    error.response?.data?.message ||
                    "Failed to load active session"
                );

            }

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadActiveSession();
    }, []);

    /*
     * Live countdown
     */
    useEffect(() => {

        if (
            !session ||
            session.status !== "ACTIVE"
        ) {
            return;
        }

        const timer = setInterval(() => {

            const time = getRemainingTime(
                session.endTime
            );

            setRemaining(time);

            /*
             * Countdown reached zero.
             * Ask backend for the actual session status.
             */
            if (time.total <= 0) {

                clearInterval(timer);

                loadActiveSession();
            }

        }, 1000);

        return () => clearInterval(timer);

    }, [session]);

    const handleCreateSession = async () => {

        try {

            setCreating(true);
            setError("");

            const data = await createSession();

            setSession(data);

            setRemaining(
                getRemainingTime(data.endTime)
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create session"
            );

        } finally {

            setCreating(false);

        }
    };

    const handleCloseSession = async () => {

        if (!session) {
            return;
        }

        try {

            setClosing(true);
            setError("");

            const data = await closeSession(session.id);

            setSession(data);
            setRemaining(null);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to close session"
            );

        } finally {

            setClosing(false);

        }
    };

    if (loading) {
        return <p>Loading session...</p>;
    }

    return (
        <div>

            <div className="page-header">
                <div>
                    <h1>Attendance Session</h1>

                    <p>
                        Create and manage today's attendance session.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}

            {!session && (

                <div className="session-empty">

                    <CalendarDays size={48} />

                    <h2>No Active Session</h2>

                    <p>
                        Create a session to start taking attendance.
                    </p>

                    <button
                        className="primary-button"
                        onClick={handleCreateSession}
                        disabled={creating}
                    >
                        <Play size={18} />

                        {creating
                            ? "Creating..."
                            : "Create Session"
                        }
                    </button>

                </div>
            )}

            {session && (

                <div className="session-card">

                    <div className="session-card-header">

                        <div>

                            <span className="session-label">
                                SESSION #{session.id}
                            </span>

                            <h2>
                                Today's Attendance
                            </h2>

                        </div>

                        <span
                            className={
                                session.status === "ACTIVE"
                                    ? "status active"
                                    : "status closed"
                            }
                        >
                            {session.status}
                        </span>

                    </div>


                    <div className="session-details">

                        <div className="session-detail">

                            <Clock size={20} />

                            <div>

                                <span>
                                    Start Time
                                </span>

                                <strong>
                                    {new Date(
                                        session.startTime
                                    ).toLocaleTimeString()}
                                </strong>

                            </div>

                        </div>


                        <div className="session-detail">

                            <Clock size={20} />

                            <div>

                                <span>
                                    End Time
                                </span>

                                <strong>
                                    {new Date(
                                        session.endTime
                                    ).toLocaleTimeString()}
                                </strong>

                            </div>

                        </div>


                        <div className="session-detail">

                            <CalendarDays size={20} />

                            <div>

                                <span>
                                    Date
                                </span>

                                <strong>
                                    {session.date}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {session.status === "ACTIVE" && remaining && (

                        <div className="countdown-section">

                            <span className="countdown-label">
                                TIME REMAINING
                            </span>

                            <div className="countdown">

                                {formatTime(remaining.hours)}
                                :
                                {formatTime(remaining.minutes)}
                                :
                                {formatTime(remaining.seconds)}

                            </div>

                            <div className="session-active-message">

                                <span className="live-dot" />

                                Attendance session is active

                            </div>

                        </div>
                    )}


                    {session.status === "ACTIVE" && (

                        <div className="session-actions">

                            <button
                                className="secondary-button"
                                onClick={() =>
                                    navigate(
                                        `/faculty/session/${session.id}/attendance`
                                    )
                                }
                            >
                                <Users size={17} />
                                View Attendance
                            </button>

                            <button
                                className="danger-button"
                                onClick={handleCloseSession}
                                disabled={closing}
                            >

                                <Square size={17} />

                                {closing
                                    ? "Closing..."
                                    : "Close Session"
                                }

                            </button>

                        </div>

                    )}


                    {session.status === "CLOSED" && (

                        <div className="session-closed-message">

                            <Clock size={18} />

                            This session is closed.

                        </div>

                    )}

                </div>
            )}

        </div>
    );
}