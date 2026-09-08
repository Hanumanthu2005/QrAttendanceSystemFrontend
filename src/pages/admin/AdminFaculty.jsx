import { useEffect, useState } from "react";
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../../services/adminService";
import "./AdminFaculty.css";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  facultyId: "",
};

function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH FACULTY
  // =========================

  const fetchFaculty = async () => {
    try {
      setLoading(true);

      const data = await getAllFaculty();

      setFaculty(data);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);

      alert("Failed to load faculty");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // =========================
  // ADD FACULTY
  // =========================

  const handleAddFaculty = () => {
    setEditingFaculty(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // =========================
  // EDIT FACULTY
  // =========================

  const handleEditFaculty = (member) => {
    setEditingFaculty(member);

    setForm({
      name: member.name || "",
      email: member.email || "",
      password: "",
      facultyId: member.facultyId || "",
    });

    setShowModal(true);
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingFaculty) {
        await updateFaculty(editingFaculty.id, {
          name: form.name,
          email: form.email,
          facultyId: form.facultyId,
        });

        alert("Faculty updated successfully");
      } else {
        await createFaculty({
          name: form.name,
          email: form.email,
          password: form.password,
          facultyId: form.facultyId,
        });

        alert("Faculty created successfully");
      }

      setShowModal(false);
      setEditingFaculty(null);
      setForm(emptyForm);

      await fetchFaculty();
    } catch (error) {
      console.error("Failed to save faculty:", error);

      const message =
        error.response?.data?.message ||
        "Failed to save faculty";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDeleteFaculty = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this faculty member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFaculty(id);

      alert("Faculty deleted successfully");

      await fetchFaculty();
    } catch (error) {
      console.error("Failed to delete faculty:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete faculty";

      alert(message);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredFaculty = faculty.filter((member) => {
    const value = search.toLowerCase();

    return (
      member.name?.toLowerCase().includes(value) ||
      member.email?.toLowerCase().includes(value) ||
      member.facultyId?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="admin-faculty">

      {/* HEADER */}

      <div className="faculty-header">
        <div>
          <h1>Faculty Management</h1>

          <p>
            Manage all faculty members in the attendance system.
          </p>
        </div>

        <button
          className="add-faculty-btn"
          onClick={handleAddFaculty}
        >
          + Add Faculty
        </button>
      </div>


      {/* SEARCH */}

      <div className="faculty-toolbar">
        <input
          type="text"
          placeholder="Search by name, email or faculty ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="faculty-count">
          {filteredFaculty.length} faculty
        </span>
      </div>


      {/* TABLE */}

      <div className="faculty-table-container">

        {loading ? (
          <div className="loading">
            Loading faculty...
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="empty-state">
            No faculty found.
          </div>
        ) : (
          <table className="faculty-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Faculty ID</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFaculty.map((member, index) => (
                <tr key={member.id}>

                  <td>
                    {index + 1}
                  </td>

                  <td className="faculty-name">
                    {member.name}
                  </td>

                  <td>
                    {member.facultyId}
                  </td>

                  <td>
                    {member.email}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        member.status?.toLowerCase()
                      }`}
                    >
                      {member.status || "ACTIVE"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditFaculty(member)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteFaculty(member.id)
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


      {/* MODAL */}

      {showModal && (
        <div className="modal-overlay">

          <div className="faculty-modal">

            <div className="modal-header">

              <div>
                <h2>
                  {editingFaculty
                    ? "Edit Faculty"
                    : "Add Faculty"}
                </h2>

                <p>
                  {editingFaculty
                    ? "Update faculty information"
                    : "Create a new faculty account"}
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

              {/* NAME */}

              <div className="form-group">

                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter faculty name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter faculty email"
                  required
                />

              </div>


              {/* PASSWORD */}

              {!editingFaculty && (
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


              {/* FACULTY ID */}

              <div className="form-group">

                <label>Faculty ID</label>

                <input
                  type="text"
                  name="facultyId"
                  value={form.facultyId}
                  onChange={handleChange}
                  placeholder="Enter faculty ID"
                  required
                />

              </div>


              {/* ACTIONS */}

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
                    : editingFaculty
                    ? "Update Faculty"
                    : "Create Faculty"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminFaculty;