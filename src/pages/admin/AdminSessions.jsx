import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Eye,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  getAllSessions,
  getAdminSessionAttendance,
} from "../../services/adminService";

import "./AdminSessions.css";

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllSessions();

      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load attendance sessions."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        String(session.id || "").toLowerCase().includes(searchValue) ||
        String(session.facultyId || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        String(session.status || "").toUpperCase() === statusFilter;

      const matchesDate =
        !dateFilter || session.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [sessions, search, statusFilter, dateFilter]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "open") {
      return "status-open";
    }

    if (normalizedStatus === "closed") {
      return "status-closed";
    }

    return "status-default";
  };

  const handleViewAttendance = async (session) => {
    try {
      setSelectedSession(session);
      setAttendance([]);
      setAttendanceError("");
      setAttendanceLoading(true);

      const data = await getAdminSessionAttendance(session.id);

      /*
       * The backend may return either:
       * 1. an array of attendance records
       * 2. a report object containing an "attendances" array
       */
      if (Array.isArray(data)) {
        setAttendance(data);
      } else if (Array.isArray(data?.attendances)) {
        setAttendance(data.attendances);
      } else {
        setAttendance([]);
      }
    } catch (err) {
      console.error("Failed to fetch session attendance:", err);

      setAttendanceError(
        err.response?.data?.message ||
          "Failed to load attendance for this session."
      );
    } finally {
      setAttendanceLoading(false);
    }
  };

  const closeAttendanceModal = () => {
    setSelectedSession(null);
    setAttendance([]);
    setAttendanceError("");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDateFilter("");
  };

  return (
    <div className="admin-sessions-page">
      {/* Header */}
      <div className="admin-sessions-header">
        <div>
          <h1>Attendance Sessions</h1>
          <p>
            View and monitor all attendance sessions created by faculty.
          </p>
        </div>

        <button
          className="sessions-refresh-btn"
          onClick={fetchSessions}
          disabled={loading}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="sessions-stats">
        <div className="session-stat-card">
          <div className="session-stat-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>Total Sessions</span>
            <strong>{sessions.length}</strong>
          </div>
        </div>

        <div className="session-stat-card">
          <div className="session-stat-icon">
            <Clock size={22} />
          </div>

          <div>
            <span>Open Sessions</span>
            <strong>
              {
                sessions.filter(
                  (session) =>
                    String(session.status || "").toUpperCase() === "OPEN"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="session-stat-card">
          <div className="session-stat-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>Closed Sessions</span>
            <strong>
              {
                sessions.filter(
                  (session) =>
                    String(session.status || "").toUpperCase() === "CLOSED"
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sessions-filter-card">
        <div className="sessions-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by session ID or faculty ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        {(search || statusFilter !== "ALL" || dateFilter) && (
          <button className="sessions-clear-btn" onClick={clearFilters}>
            <X size={17} />
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="sessions-error">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="sessions-table-card">
        <div className="sessions-table-header">
          <div>
            <h2>All Sessions</h2>
            <span>
              Showing {filteredSessions.length} of {sessions.length} sessions
            </span>
          </div>
        </div>

        {loading ? (
          <div className="sessions-state">
            <div className="sessions-spinner"></div>
            <p>Loading sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="sessions-state">
            <CalendarDays size={42} />
            <h3>No sessions found</h3>
            <p>
              {sessions.length === 0
                ? "No attendance sessions have been created yet."
                : "Try changing your search or filters."}
            </p>
          </div>
        ) : (
          <div className="sessions-table-wrapper">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Faculty ID</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.id}>
                    <td>
                      <span className="session-id">
                        #{session.id}
                      </span>
                    </td>

                    <td>
                      <span className="faculty-id">
                        {session.facultyId || "-"}
                      </span>
                    </td>

                    <td>
                      <div className="session-date">
                        <CalendarDays size={16} />
                        {formatDate(session.date)}
                      </div>
                    </td>

                    <td>
                      {formatTime(session.startTime)}
                    </td>

                    <td>
                      {formatTime(session.endTime)}
                    </td>

                    <td>
                      <span
                        className={`session-status ${getStatusClass(
                          session.status
                        )}`}
                      >
                        {session.status || "-"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-attendance-btn"
                        onClick={() => handleViewAttendance(session)}
                      >
                        <Eye size={17} />
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

      {/* Attendance Modal */}
      {selectedSession && (
        <div
          className="session-modal-overlay"
          onClick={closeAttendanceModal}
        >
          <div
            className="session-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="session-modal-header">
              <div>
                <h2>Session #{selectedSession.id}</h2>

                <p>
                  Faculty:{" "}
                  <strong>{selectedSession.facultyId || "-"}</strong>
                  {" • "}
                  {formatDate(selectedSession.date)}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeAttendanceModal}
              >
                <X size={21} />
              </button>
            </div>

            {attendanceLoading ? (
              <div className="sessions-state modal-state">
                <div className="sessions-spinner"></div>
                <p>Loading attendance...</p>
              </div>
            ) : attendanceError ? (
              <div className="modal-error">
                {attendanceError}
              </div>
            ) : attendance.length === 0 ? (
              <div className="sessions-state modal-state">
                <CalendarDays size={40} />
                <h3>No attendance records</h3>
                <p>
                  There are no attendance records for this session.
                </p>
              </div>
            ) : (
              <div className="attendance-modal-content">
                <div className="attendance-count">
                  Total records: <strong>{attendance.length}</strong>
                </div>

                <div className="attendance-table-wrapper">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Roll Number</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendance.map((record, index) => (
                        <tr key={record.id || index}>
                          <td>
                            {record.studentName || "-"}
                          </td>

                          <td>
                            {record.studentRoll || "-"}
                          </td>

                          <td>
                            {formatDate(record.attendanceDate)}
                          </td>

                          <td>
                            {formatTime(record.attendanceTime)}
                          </td>

                          <td>
                            <span
                              className={`attendance-status ${
                                String(record.status || "")
                                  .toLowerCase() === "present"
                                  ? "attendance-present"
                                  : "attendance-absent"
                              }`}
                            >
                              {record.status || "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessions;