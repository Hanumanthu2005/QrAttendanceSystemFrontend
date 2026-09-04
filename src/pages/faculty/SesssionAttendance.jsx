import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Users,
    Clock
} from "lucide-react";

import { getSessionAttendance } from "../../services/sessionService";

export default function SessionAttendance() {

    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReport = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getSessionAttendance(sessionId);

            setReport(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load session attendance"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadReport();
    }, [sessionId]);

    if (loading) {
        return <p>Loading attendance report...</p>;
    }

    if (error) {
        return (
            <div>

                <button
                    className="back-button"
                    onClick={() => navigate("/faculty/session")}
                >
                    <ArrowLeft size={18} />
                    Back to Session
                </button>

                <div className="alert error">
                    {error}
                </div>

            </div>
        );
    }

    if (!report) {
        return null;
    }

    // Backend returns "attendances"
    const students = report.attendances || [];

    const presentCount = students.filter(
        student => student.status === "PRESENT"
    ).length;

    const absentCount = students.length - presentCount;

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <button
                    className="back-button"
                    onClick={() => navigate("/faculty/session")}
                >
                    <ArrowLeft size={18} />
                    Back to Session
                </button>

                <div className="session-report-heading">

                    <div>

                        <span className="session-label">
                            SESSION #{report.sessionId}
                        </span>

                        <h1>
                            Session Attendance
                        </h1>

                        <p>
                            {report.date}
                        </p>

                    </div>

                    <span
                        className={
                            report.status === "ACTIVE"
                                ? "status active"
                                : "status closed"
                        }
                    >
                        {report.status}
                    </span>

                </div>

            </div>


            {/* ================= SESSION INFO ================= */}

            <div className="report-info-grid">

                <div className="report-info-card">

                    <Users size={22} />

                    <div>

                        <span>
                            Total Students
                        </span>

                        <strong>
                            {students.length}
                        </strong>

                    </div>

                </div>


                <div className="report-info-card">

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


                <div className="report-info-card">

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


                <div className="report-info-card">

                    <Clock size={22} />

                    <div>

                        <span>
                            Session Time
                        </span>

                        <strong>
                            {new Date(
                                report.startTime
                            ).toLocaleTimeString()}
                            {" - "}
                            {new Date(
                                report.endTime
                            ).toLocaleTimeString()}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= ATTENDANCE TABLE ================= */}

            <div className="attendance-table-card">

                <div className="table-header">

                    <div>

                        <h2>
                            Students
                        </h2>

                        <p>
                            Attendance recorded for this session
                        </p>

                    </div>

                </div>


                {students.length === 0 ? (

                    <div className="table-empty">

                        <Users size={40} />

                        <h3>
                            No students found
                        </h3>

                        <p>
                            There are no students assigned to this faculty.
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
                                        Attendance Time
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {students.map((student) => {

                                    const isPresent =
                                        student.status === "PRESENT";

                                    return (

                                        <tr key={student.id}>

                                            <td>

                                                <div className="student-cell">

                                                    <div className="student-avatar">

                                                        {student.studentName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>

                                                    <strong>
                                                        {student.studentName}
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>
                                                {student.studentRoll}
                                            </td>


                                            <td>

                                                {student.attendanceTime
                                                    ? new Date(
                                                        student.attendanceTime
                                                    ).toLocaleTimeString()
                                                    : "—"}

                                            </td>


                                            <td>

                                                {isPresent ? (

                                                    <span className="attendance-status present">

                                                        <CheckCircle size={16} />

                                                        PRESENT

                                                    </span>

                                                ) : (

                                                    <span className="attendance-status absent">

                                                        <XCircle size={16} />

                                                        ABSENT

                                                    </span>

                                                )}

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