import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle,
    RefreshCw,
    XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getFacultyAttendance,
    getFacultyAttendanceByDateRange
} from "../../services/facultyService";

export default function FacultyAttendance() {

    const navigate = useNavigate();

    const [attendance, setAttendance] = useState([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [filtering, setFiltering] = useState(false);
    const [error, setError] = useState("");

    const loadAttendance = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getFacultyAttendance();

            setAttendance(data || []);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load attendance"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadAttendance();
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
                await getFacultyAttendanceByDateRange(
                    startDate,
                    endDate
                );

            setAttendance(data || []);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to filter attendance"
            );

        } finally {

            setFiltering(false);

        }
    };

    const clearFilter = async () => {

        setStartDate("");
        setEndDate("");

        await loadAttendance();
    };

    const presentCount = attendance.filter(
        item => item.status === "PRESENT"
    ).length;

    const absentCount = attendance.filter(
        item => item.status === "ABSENT"
    ).length;

    if (loading) {
        return (
            <div className="loading-page">
                <p>Loading attendance...</p>
            </div>
        );
    }

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
                        Attendance
                    </h1>

                    <p>
                        View attendance records marked during your sessions.
                    </p>

                </div>

                <button
                    className="secondary-button"
                    onClick={loadAttendance}
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
                            Filter by Date
                        </h2>

                        <p>
                            Select a date range to view attendance.
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
                        <CalendarDays size={17} />

                        {filtering
                            ? "Filtering..."
                            : "Apply Filter"}

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


            {/* ================= SUMMARY ================= */}

            <div className="student-history-summary">

                <div className="history-summary-card">

                    <CalendarDays size={22} />

                    <div>

                        <span>
                            Total Records
                        </span>

                        <strong>
                            {attendance.length}
                        </strong>

                    </div>

                </div>


                <div className="history-summary-card">

                    <CheckCircle size={22} />

                    <div>

                        <span>
                            Present
                        </span>

                        <strong>
                            {presentCount}
                        </strong>

                    </div>

                </div>


                <div className="history-summary-card">

                    <XCircle size={22} />

                    <div>

                        <span>
                            Absent
                        </span>

                        <strong>
                            {absentCount}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= TABLE ================= */}

            <div className="attendance-table-card">

                <div className="table-header">

                    <div>

                        <h2>
                            Attendance Records
                        </h2>

                        <p>
                            {startDate && endDate
                                ? `${startDate} to ${endDate}`
                                : "All attendance records"}
                        </p>

                    </div>

                </div>


                {attendance.length === 0 ? (

                    <div className="table-empty">

                        <CalendarDays size={42} />

                        <h3>
                            No attendance records
                        </h3>

                        <p>
                            No attendance records were found.
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
                                        Date
                                    </th>

                                    <th>
                                        Time
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {attendance.map((item) => (

                                    <tr key={item.id}>

                                        <td>

                                            <div className="student-cell">

                                                <div className="student-avatar">

                                                    {item.studentName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>

                                                <strong>
                                                    {item.studentName}
                                                </strong>

                                            </div>

                                        </td>


                                        <td>
                                            {item.studentRoll}
                                        </td>


                                        <td>
                                            {item.attendanceDate}
                                        </td>


                                        <td>

                                            {item.attendanceTime
                                                ? new Date(
                                                    item.attendanceTime
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                                : "—"}

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

                                                    {item.status || "ABSENT"}

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
    );
}