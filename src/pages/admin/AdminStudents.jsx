import { useEffect, useState } from "react";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../services/adminService";
import "./AdminStudents.css";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  roll: "",
  facultyId: "",
};

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Open add modal
  const handleAddStudent = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // Open edit modal
  const handleEditStudent = (student) => {
    setEditingStudent(student);

    setForm({
      name: student.name || "",
      email: student.email || "",
      password: "",
      roll: student.roll || "",
      facultyId: student.facultyId || "",
    });

    setShowModal(true);
  };

  // Input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingStudent) {
        await updateStudent(editingStudent.id, {
          name: form.name,
          email: form.email,
          roll: form.roll,
          facultyId: form.facultyId,
        });

        alert("Student updated successfully");
      } else {
        await createStudent(form);

        alert("Student created successfully");
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingStudent(null);

      await fetchStudents();
    } catch (error) {
      console.error("Failed to save student:", error);

      const message =
        error.response?.data?.message ||
        "Failed to save student";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await deleteStudent(id);

      alert("Student deleted successfully");

      await fetchStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete student";

      alert(message);
    }
  };

  // Search
  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(value) ||
      student.email?.toLowerCase().includes(value) ||
      student.roll?.toLowerCase().includes(value) ||
      student.facultyId?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="admin-students">
      <div className="students-header">
        <div>
          <h1>Student Management</h1>
          <p>Manage all students in the attendance system.</p>
        </div>

        <button
          className="add-student-btn"
          onClick={handleAddStudent}
        >
          + Add Student
        </button>
      </div>

      <div className="students-toolbar">
        <input
          type="text"
          placeholder="Search by name, email, roll or faculty ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="student-count">
          {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="students-table-container">
        {loading ? (
          <div className="loading">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            No students found.
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Email</th>
                <th>Faculty ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>

                  <td className="student-name">
                    {student.name}
                  </td>

                  <td>{student.roll}</td>

                  <td>{student.email}</td>

                  <td>{student.facultyId || "-"}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        student.status?.toLowerCase()
                      }`}
                    >
                      {student.status || "ACTIVE"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditStudent(student)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteStudent(student.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="student-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingStudent
                    ? "Edit Student"
                    : "Add Student"}
                </h2>

                <p>
                  {editingStudent
                    ? "Update student information"
                    : "Create a new student account"}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              {!editingStudent && (
                <div className="form-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Roll Number</label>

                  <input
                    type="text"
                    name="roll"
                    value={form.roll}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Faculty ID</label>

                  <input
                    type="text"
                    name="facultyId"
                    value={form.facultyId}
                    onChange={handleChange}
                    placeholder="Faculty ID"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingStudent
                    ? "Update Student"
                    : "Create Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudents;