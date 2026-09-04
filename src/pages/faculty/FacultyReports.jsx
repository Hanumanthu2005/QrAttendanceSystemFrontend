import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    BarChart3,
    CalendarDays,
    CheckCircle,
    RefreshCw,
    Users,
    XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getFacultyAttendanceSummary,
    getFacultyAttendanceSummaryByDateRange
} from "../../services/facultyService";

export default function FacultyReports() {

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

            const data =
                await getFacultyAttendanceSummary();

            setSummary(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load attendance report"
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
                await getFacultyAttendanceSummaryByDateRange(
                    startDate,
                    endDate
                );

            setSummary(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to generate report"
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
                <p>Loading reports...</p>
            </div>
        );

    }

    if (!summary) {
        return null;
    }

    const students =
        summary.studentAttendanceSummaries || [];

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/faculty/dashboard")
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>

                    <span className="eyebrow">
                        FACULTY
                    </span>

                    <h1>
                        Attendance Reports
                    </h1>

                    <p>
                        Analyze attendance performance across your students.
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

                    <CalendarDays size={20} />

                    <div>

                        <h2>
                            Report Period
                        </h2>

                        <p>
                            Generate a report for a specific date range.
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
                            : "Generate Report"}

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


            {/* ================= SUMMARY CARDS ================= */}

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
                            {students.length}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon">
                        <BarChart3 size={22} />
                    </div>

                    <div>

                        <span>
                            Faculty
                        </span>

                        <strong>
                            {summary.facultyId}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= STUDENT REPORT ================= */}

            <div className="attendance-table-card">

                <div className="table-header">

                    <div>

                        <h2>
                            Student Attendance
                        </h2>

                        <p>
                            Attendance performance of your students.
                        </p>

                    </div>

                </div>


                {students.length === 0 ? (

                    <div className="table-empty">

                        <Users size={42} />

                        <h3>
                            No student data
                        </h3>

                        <p>
                            No attendance data is available for this period.
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
                                        Total Sessions
                                    </th>

                                    <th>
                                        Present
                                    </th>

                                    <th>
                                        Absent
                                    </th>

                                    <th>
                                        Attendance
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {students.map((student, index) => {

                                    const percentage =
                                        Number(
                                            student.attendancePercentage || 0
                                        );

                                    return (

                                        <tr
                                            key={
                                                student.roll ||
                                                student.studentRoll ||
                                                index
                                            }
                                        >

                                            <td>

                                                <div className="student-cell">

                                                    <div className="student-avatar">

                                                        {student.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>

                                                    <strong>
                                                        {student.name}
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>
                                                {student.roll}
                                            </td>


                                            <td>
                                                {student.totalSessions}
                                            </td>


                                            <td>

                                                <span className="report-number present-number">

                                                    <CheckCircle size={15} />

                                                    {student.presentSessions}

                                                </span>

                                            </td>


                                            <td>

                                                <span className="report-number absent-number">

                                                    <XCircle size={15} />

                                                    {student.absentSessions}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="attendance-percentage-cell">

                                                    <strong>
                                                        {percentage.toFixed(1)}%
                                                    </strong>

                                                    <div className="percentage-bar">

                                                        <div
                                                            className="percentage-fill"
                                                            style={{
                                                                width: `${Math.min(
                                                                    Math.max(
                                                                        percentage,
                                                                        0
                                                                    ),
                                                                    100
                                                                )}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}