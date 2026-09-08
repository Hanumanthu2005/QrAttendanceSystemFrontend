import { useEffect, useState } from "react";
import {
  getAllAttendance,
  getAttendanceByDateRange,
} from "../../services/adminService";
import "./AdminAttendance.css";

function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  // =========================
  // FETCH ALL ATTENDANCE
  // =========================

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const data = await getAllAttendance();

      setAttendance(data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);

      alert("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // =========================
  // DATE FILTER
  // =========================

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start date and end date");
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }

    try {
      setFiltering(true);

      const data = await getAttendanceByDateRange(
        startDate,
        endDate
      );

      setAttendance(data);
    } catch (error) {
      console.error("Failed to filter attendance:", error);

      const message =
        error.response?.data?.message ||
        "Failed to filter attendance";

      alert(message);
    } finally {
      setFiltering(false);
    }
  };

  // =========================
  // CLEAR FILTER
  // =========================

  const handleClearFilter = async () => {
    setStartDate("");
    setEndDate("");
    setSearch("");

    await fetchAttendance();
  };

  // =========================
  // SEARCH
  // =========================

  const filteredAttendance = attendance.filter((record) => {
    const value = search.toLowerCase();

    return (
      record.studentName?.toLowerCase().includes(value) ||
      record.studentRoll?.toLowerCase().includes(value) ||
      record.facultyId?.toLowerCase().includes(value)
    );
  });

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (time) => {
    if (!time) return "-";

    return new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-attendance">

      {/* HEADER */}

      <div className="attendance-header">
        <div>
          <h1>Attendance Management</h1>

          <p>
            View and filter attendance records across the system.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchAttendance}
        >
          ↻ Refresh
        </button>
      </div>


      {/* FILTER SECTION */}

      <div className="attendance-filters">

        <div className="filter-group">
          <label>Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />
        </div>


        <div className="filter-group">
          <label>End Date</label>

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
          />
        </div>


        <button
          className="filter-btn"
          onClick={handleFilter}
          disabled={filtering}
        >
          {filtering ? "Filtering..." : "Apply Filter"}
        </button>


        <button
          className="clear-filter-btn"
          onClick={handleClearFilter}
        >
          Clear
        </button>

      </div>


      {/* SEARCH */}

      <div className="attendance-toolbar">

        <input
          type="text"
          placeholder="Search by student name, roll number or faculty ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <span>
          {filteredAttendance.length} record
          {filteredAttendance.length !== 1
            ? "s"
            : ""}
        </span>

      </div>


      {/* TABLE */}

      <div className="attendance-table-container">

        {loading ? (
          <div className="loading">
            Loading attendance...
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="empty-state">
            No attendance records found.
          </div>
        ) : (
          <table className="attendance-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Faculty ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.map(
                (record, index) => (
                  <tr key={record.id}>

                    <td>{index + 1}</td>

                    <td className="student-name">
                      {record.studentName || "-"}
                    </td>

                    <td>
                      {record.studentRoll || "-"}
                    </td>

                    <td>
                      {record.facultyId || "-"}
                    </td>

                    <td>
                      {formatDate(
                        record.attendanceDate
                      )}
                    </td>

                    <td>
                      {formatTime(
                        record.attendanceTime
                      )}
                    </td>

                    <td>
                      <span
                        className={`attendance-status ${
                          record.status?.toLowerCase()
                        }`}
                      >
                        {record.status || "-"}
                      </span>
                    </td>

                  </tr>
                )
              )}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default AdminAttendance;