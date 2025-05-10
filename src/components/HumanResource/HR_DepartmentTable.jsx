// src/components/HumanResource/HR_DepartmentTable.jsx
import React, { useEffect, useState } from "react";
import SearchBar from "../General/SearchBar"; // Đảm bảo đúng path
import "../../styles/HumanResourceStyles/HR_DepartmentTable.css";

const HR_DepartmentTable = ({ style }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [addError, setAddError] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [updatedDepartmentName, setUpdatedDepartmentName] = useState("");
  const [updatingDepartment, setUpdatingDepartment] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
    const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

    if (!token) {
      console.error("Token không tồn tại");
      return;
    }

    fetch("http://localhost:5000/api/departments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token dưới dạng Bearer token
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) {
      setAddError("Tên phòng ban không được để trống");
      return;
    }

    setAddingDepartment(true);
    setAddError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await fetch("http://localhost:5000/api/department/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ departmentName: newDepartmentName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể thêm phòng ban");
      }

      await res.json();
      setNewDepartmentName("");
      setShowAddModal(false);
      fetchDepartments();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddingDepartment(false);
    }
  };

  const handleOpenUpdate = () => {
    if (!isUpdatingMode) {
      setIsUpdatingMode(true);
      return;
    }

    if (!selectedDepartment) {
      setIsUpdatingMode(false);
      return;
    }

    setUpdatedDepartmentName(selectedDepartment.departmentName);
    setShowUpdateModal(true);
    setUpdateError(null);
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!updatedDepartmentName.trim()) {
      setUpdateError("Tên phòng ban không được để trống");
      return;
    }

    setUpdatingDepartment(true);
    setUpdateError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await fetch(
        `http://localhost:5000/api/department/update/${selectedDepartment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ departmentName: updatedDepartmentName }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể cập nhật phòng ban");
      }

      await res.json();
      setShowUpdateModal(false);
      setSelectedDepartment(null);
      setIsUpdatingMode(false);
      fetchDepartments();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdatingDepartment(false);
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      dept.departmentName.toLowerCase().includes(keyword) ||
      dept.id.toString().includes(keyword)
    );
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIdOrName, setDeleteIdOrName] = useState("");
  const [deleteError, setDeleteError] = useState(null);

  const [deleteStep, setDeleteStep] = useState("input"); // hoặc "confirm"
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleDeleteDepartments = async () => {
    if (!deleteIdOrName.trim()) {
      setDeleteError("Vui lòng nhập ID hoặc tên phòng ban muốn xóa");
      return;
    }

    setDeleteError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await fetch(
        `http://localhost:5000/api/department/delete/${deleteIdOrName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();

        if (res.status === 409 && errorData.hasDependencies) {
          setPendingDeleteId(deleteIdOrName);
          setDeleteStep("confirm");
          return;
        }

        throw new Error(errorData.message || "Không thể xóa Phòng ban");
      }

      setDeleteIdOrName("");
      setShowDeleteModal(false);
      setDeleteStep("input");
      fetchDepartments();
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  const handleConfirmDeleteDependencies = async () => {
    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      await fetch(
        `http://localhost:5000/api/department/delete/${pendingDeleteId}?force=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Đã xóa phòng ban và dữ liệu liên quan.");
      setDeleteIdOrName("");
      setShowDeleteModal(false);
      setDeleteStep("input");
      fetchDepartments();
    } catch (err) {
      setDeleteError(err.message);
      setDeleteStep("input");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="depart-table-header">
        <div>Department list</div>

        <div className="table-button-container">
          <button
            className="table-button add"
            onClick={() => setShowAddModal(true)}
          >
            <strong>Add</strong>
          </button>
          <button className="table-button" onClick={handleOpenUpdate}>
            <strong>Update</strong>
          </button>
          <button
            className="table-button delete"
            onClick={() => setShowDeleteModal(true)}
          >
            <strong>Delete</strong>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <SearchBar
          placeholder="Search by ID or Department Name"
          onSearch={setSearchKeyword}
        />
      </div>

      {/* Modal thêm */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-department-modal">
            <h3>Add New Department</h3>
            {addError && <div className="error-message">{addError}</div>}
            <form onSubmit={handleAddDepartment}>
              <div className="form-group-department">
                <input
                  type="text"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewDepartmentName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={addingDepartment}
                >
                  {addingDepartment ? "Adding..." : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal update */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="add-department-modal">
            <h3>Update Department</h3>
            {updateError && <div className="error-message">{updateError}</div>}
            <form onSubmit={handleUpdateDepartment}>
              <div className="form-group">
                <input
                  type="text"
                  value={updatedDepartmentName}
                  onChange={(e) => setUpdatedDepartmentName(e.target.value)}
                  placeholder="Enter new department name"
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedDepartment(null);
                    setIsUpdatingMode(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={updatingDepartment}
                >
                  {updatingDepartment ? "Updating..." : "Update Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal delete */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-department-modal">
            <h3>Delete Departments</h3>

            {deleteStep === "input" && (
              <>
                {deleteError && (
                  <div className="error-message">{deleteError}</div>
                )}
                <div className="form-group-department">
                  <input
                    type="text"
                    value={deleteIdOrName}
                    onChange={(e) => setDeleteIdOrName(e.target.value)}
                    placeholder="Enter Department ID or Name"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteStep("input");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-submit"
                    onClick={handleDeleteDepartments}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

            {deleteStep === "confirm" && (
              <>
                <div class="comfirm-container">
                  <p className="confirm-message">
                    Phòng ban ID <b>{pendingDeleteId}</b> đang có dữ liệu ràng
                    buộc trong bảng <b>Employees</b>.
                    <br />
                    <i>Bạn có muốn xóa luôn dữ liệu liên quan không?</i>
                  </p>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setDeleteStep("input");
                      setDeleteError(null);
                    }}
                  >
                    Không xóa
                  </button>
                  <button
                    type="button"
                    className="btn-submit"
                    onClick={handleConfirmDeleteDependencies}
                    // style={{ background: 'red' }}
                  >
                    Xóa liên quan
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="depart-table-container" style={style}>
        <table className="depart-table">
          <thead>
            <tr>
              {isUpdatingMode && <th>Select</th>}
              <th>ID</th>
              <th>Department name</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept, index) => (
              <tr key={index} className="depart-table-row">
                {isUpdatingMode && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedDepartment?.id === dept.id}
                      onChange={() => {
                        if (selectedDepartment?.id === dept.id) {
                          setSelectedDepartment(null);
                        } else {
                          setSelectedDepartment(dept);
                        }
                      }}
                    />
                  </td>
                )}
                <td>{dept.id}</td>
                <td>{dept.departmentName}</td>
                <td>{dept.createdAt}</td>
                <td>{dept.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

HR_DepartmentTable.defaultProps = {
  style: {},
};

export default HR_DepartmentTable;
