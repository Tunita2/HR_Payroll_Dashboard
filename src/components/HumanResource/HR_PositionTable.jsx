import React, { useEffect, useState } from "react";
import "../../styles/HumanResourceStyles/HR_PositionTable.css";
import SearchBar from "../General/SearchBar";

const HR_PositionTable = ({ style }) => {
  const [job, setPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPositionName, setNewPositionName] = useState("");
  const [addingPosition, setAddingPosition] = useState(false);
  const [addError, setAddError] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [updatedPositionName, setUpdatedPositionName] = useState("");
  const [updatingPosition, setUpdatingPosition] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIdOrName, setDeleteIdOrName] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [deleteStep, setDeleteStep] = useState("input"); // hoặc "confirm"
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const userRole = localStorage.getItem("role"); 

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = () => {
    // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
    const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

    if (!token) {
      console.error("Token không tồn tại");
      return;
    }

    fetch("http://localhost:5000/api/positions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token dưới dạng Bearer token
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Dữ liệu nhận được:", data); // THÊM DÒNG NÀY
        setPosition(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const filterPositions = job.filter((posit) => {
    const keyword = searchKeyword.toLowerCase();

    return (
      posit.id.toString().includes(keyword) ||
      posit.positionName.toLowerCase().includes(keyword)
    );
  });

  const handleAddPosition = async (e) => {
    e.preventDefault();
    if (!newPositionName.trim()) {
      setAddError("Tên vị trí không được để trống");
      return;
    }

    setAddingPosition(true);
    setAddError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await fetch("http://localhost:5000/api/position/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ positionName: newPositionName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể thêm vị trí");
      }

      await res.json();
      setNewPositionName("");
      setShowAddModal(false);
      fetchPositions();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddingPosition(false);
    }
  };

  const handleOpenUpdate = () => {
    if (!isUpdatingMode) {
      setIsUpdatingMode(true);
      return;
    }

    if (!selectedPosition) {
      setIsUpdatingMode(false);
      return;
    }

    setUpdatedPositionName(selectedPosition.positionName);
    setShowUpdateModal(true);
    setUpdateError(null);
  };

  const handleUpdatePosition = async (e) => {
    e.preventDefault();
    if (!updatedPositionName.trim()) {
      setUpdateError("Tên vị trí không được để trống");
      return;
    }

    setUpdatingPosition(true);
    setUpdateError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await fetch(
        `http://localhost:5000/api/position/update/${selectedPosition.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ positionName: updatedPositionName }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể cập nhật vị trí");
      }

      await res.json();
      setShowUpdateModal(false);
      setSelectedPosition(null);
      setIsUpdatingMode(false);
      fetchPositions();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdatingPosition(false);
    }
  };


  const handleDeletePositions = async () => {
    if (!deleteIdOrName.trim()) {
      setDeleteError("Vui lòng nhập ID hoặc tên vị trí muốn xóa");
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
        `http://localhost:5000/api/position/delete/${deleteIdOrName}`,
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

        throw new Error(errorData.message || "Không thể xóa Vị trí");
      }

      setDeleteIdOrName("");
      setShowDeleteModal(false);
      setDeleteStep("input");
      fetchPositions();
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
        `http://localhost:5000/api/position/delete/${pendingDeleteId}?force=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Đã xóa vị trí và dữ liệu liên quan.");
      setDeleteIdOrName("");
      setShowDeleteModal(false);
      setDeleteStep("input");
      fetchPositions();
    } catch (err) {
      setDeleteError(err.message);
      setDeleteStep("input");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-bar">
          <div className="loading-progress" />
        </div>
        <p className="loading-text">Loading... Please wait</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="job-table-header">
        <div>Position List</div>

        {userRole === "admin" && (
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
          <button className="table-button" onClick={() => setShowDeleteModal(true)}>
            <strong>Delete</strong>
          </button>
        </div>
        )}
        
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <SearchBar
          placeholder="Search by ID or Position Name"
          onSearch={setSearchKeyword}
        />
      </div>

      {/* Modal thêm */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-position-modal">
            <h3>Add New Position</h3>
            {addError && <div className="error-message">{addError}</div>}
            <form onSubmit={handleAddPosition}>
              <div className="form-group-position">
                <input
                  type="text"
                  value={newPositionName}
                  onChange={(e) => setNewPositionName(e.target.value)}
                  placeholder="Enter position name"
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewPositionName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={addingPosition}
                >
                  {addingPosition ? "Adding..." : "Add Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal update */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="add-position-modal">
            <h3>Update Position</h3>
            {updateError && <div className="error-message">{updateError}</div>}
            <form onSubmit={handleUpdatePosition}>
              <div className="form-group-position">
                <input
                  type="text"
                  value={updatedPositionName}
                  onChange={(e) => setUpdatedPositionName(e.target.value)}
                  placeholder="Enter new Position name"
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedPosition(null);
                    setIsUpdatingMode(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={updatingPosition}
                >
                  {updatingPosition ? "Updating..." : "Update Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal delete */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-position-modal">
            <h3>Delete Position</h3>

            {deleteStep === "input" && (
              <>
                {deleteError && (
                  <div className="error-message">{deleteError}</div>
                )}
                <div className="form-group-position">
                  <input
                    type="text"
                    value={deleteIdOrName}
                    onChange={(e) => setDeleteIdOrName(e.target.value)}
                    placeholder="Enter Position ID or Name"
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
                    onClick={handleDeletePositions}
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
                    Vị trí ID <b>{pendingDeleteId}</b> đang có dữ liệu ràng buộc
                    trong bảng <b>Employees</b>.
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

      {/* Bảng hiển thị dữ liệu chức vụ */}
      <div className="job-table-container" style={style}>
        <table className="job-table">
          <thead>
            <tr>
              {isUpdatingMode && <th>Select</th>}
              <th>ID</th>
              <th>Position</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filterPositions.map((job, index) => (
              <tr key={index} className="job-table-row">
                {isUpdatingMode && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPosition?.id === job.id}
                      onChange={() => {
                        if (selectedPosition?.id === job.id) {
                          setSelectedPosition(null);
                        } else {
                          setSelectedPosition(job);
                        }
                      }}
                    />
                  </td>
                )}
                <td>{job.id}</td>
                <td>{job.positionName}</td>
                <td>{job.createdAt}</td>
                <td>{job.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

HR_PositionTable.defaultProps = {
  style: {},
};

export default HR_PositionTable;
