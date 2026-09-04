import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    BarChart3,
    CalendarDays,
    CheckCircle,
    Filter,
    RefreshCw,
    XCircle
} from "lucide-react";

import {
    getStudentAttendanceSummary,
    getStudentAttendanceSummaryByDateRange
} from "../../services/studentService";

export default function StudentSummary() {

    const navigate = useNavigate();

    const [summary, setSummary] = useState(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [filtering, setFiltering] = useState(false);
    const [error, setError] = useState("");

    const loadSummary = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getStudentAttendanceSummary();

            setSummary(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load attendance summary"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadSummary();
    }, []);

    const handleFilter = async (event) => {

        event.preventDefault();

        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }

        if (startDate > endDate) {
            setError("Start date cannot be after end date.");
            return;
        }

        try {

            setFiltering(true);
            setError("");

            const data =
                await getStudentAttendanceSummaryByDateRange(
                    startDate,
                    endDate
                );

            setSummary(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to generate summary"
            );

        } finally {

            setFiltering(false);

        }
    };

    const clearFilter = async () => {

        setStartDate("");
        setEndDate("");

        await loadSummary();
    };

    if (loading) {
        return (
            <div className="loading-page">
                <p>Loading summary...</p>
            </div>
        );
    }

    if (!summary) {
        return null;
    }

    const percentage =
        Number(summary.attendancePercentage || 0);

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/student/dashboard")
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>

                    <span className="eyebrow">
                        STUDENT
                    </span>

                    <h1>
                        Attendance Summary
                    </h1>

                    <p>
                        View your overall attendance performance.
                    </p>

                </div>

                <button
                    className="secondary-button"
                    onClick={loadSummary}
                    disabled={filtering}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>


            {/* ================= ERROR ================= */}

            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}


            {/* ================= FILTER ================= */}

            <div className="attendance-filter-card">

                <div className="filter-title">

                    <Filter size={20} />

                    <div>

                        <h2>
                            Summary Period
                        </h2>

                        <p>
                            Filter your attendance summary by date.
                        </p>

                    </div>

                </div>


                <form
                    className="attendance-filter-form"
                    onSubmit={handleFilter}
                >

                    <label>

                        Start Date

                        <input
                            type="date"
                            value={startDate}
                            onChange={e =>
                                setStartDate(e.target.value)
                            }
                        />

                    </label>


                    <label>

                        End Date

                        <input
                            type="date"
                            value={endDate}
                            onChange={e =>
                                setEndDate(e.target.value)
                            }
                        />

                    </label>


                    <button
                        type="submit"
                        className="primary-button"
                        disabled={filtering}
                    >

                        <BarChart3 size={17} />

                        {filtering
                            ? "Generating..."
                            : "Generate Summary"}

                    </button>


                    {(startDate || endDate) && (

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={clearFilter}
                            disabled={filtering}
                        >
                            Clear
                        </button>

                    )}

                </form>

            </div>


            {/* ================= STUDENT INFO ================= */}

            <div className="summary-student-info">

                <div>

                    <span>
                        Student
                    </span>

                    <strong>
                        {summary.name}
                    </strong>

                </div>

                <div>

                    <span>
                        Roll Number
                    </span>

                    <strong>
                        {summary.roll}
                    </strong>

                </div>

            </div>


            {/* ================= MAIN SUMMARY ================= */}

            <div className="student-summary-layout">

                {/* Attendance Percentage */}

                <div className="student-summary-percentage-card">

                    <div className="summary-icon">
                        <BarChart3 size={22} />
                    </div>

                    <span>
                        Attendance Percentage
                    </span>

                    <strong>
                        {percentage.toFixed(1)}%
                    </strong>

                    <div className="summary-progress">

                        <div
                            className="summary-progress-fill"
                            style={{
                                width: `${Math.min(
                                    Math.max(percentage, 0),
                                    100
                                )}%`
                            }}
                        />

                    </div>

                </div>


                {/* Statistics */}

                <div className="student-summary-stat-grid">

                    <div className="summary-stat-card">

                        <CalendarDays size={21} />

                        <div>

                            <span>
                                Total Sessions
                            </span>

                            <strong>
                                {summary.totalSessions}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-stat-card">

                        <CheckCircle size={21} />

                        <div>

                            <span>
                                Present Sessions
                            </span>

                            <strong>
                                {summary.presentSessions}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-stat-card">

                        <XCircle size={21} />

                        <div>

                            <span>
                                Absent Sessions
                            </span>

                            <strong>
                                {summary.absentSessions}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= ATTENDANCE BREAKDOWN ================= */}

            <div className="attendance-table-card">

                <div className="table-header">

                    <div>

                        <h2>
                            Attendance Breakdown
                        </h2>

                        <p>
                            Your attendance statistics for the selected period.
                        </p>

                    </div>

                </div>


                <div className="summary-breakdown">

                    <div className="summary-breakdown-row">

                        <div className="summary-breakdown-label">

                            <span className="present-indicator" />

                            <span>
                                Present
                            </span>

                        </div>

                        <strong>
                            {summary.presentSessions}
                        </strong>

                    </div>


                    <div className="summary-breakdown-row">

                        <div className="summary-breakdown-label">

                            <span className="absent-indicator" />

                            <span>
                                Absent
                            </span>

                        </div>

                        <strong>
                            {summary.absentSessions}
                        </strong>

                    </div>


                    <div className="summary-breakdown-row">

                        <div className="summary-breakdown-label">

                            <span className="total-indicator" />

                            <span>
                                Total Sessions
                            </span>

                        </div>

                        <strong>
                            {summary.totalSessions}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= QUICK ACTION ================= */}

            <div className="summary-action-card">

                <div>

                    <h2>
                        View Detailed Attendance
                    </h2>

                    <p>
                        See every attendance record with date, time,
                        faculty and status.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate("/student/attendance")
                    }
                >
                    View Attendance
                </button>

            </div>

        </div>
    );
}