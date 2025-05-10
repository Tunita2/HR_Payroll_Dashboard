import React, { useEffect, useState } from "react";
import "../../styles/HumanResourceStyles/HR_DividendTable.css";
import SearchBar from "../General/SearchBar";

const HR_DividendTable = ({ style }) => {
  const [dividends, setDividends] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDividend, setNewDividend] = useState({
    employeeID: "",
    dividendAmount: "",
    dividendDate: "",
  });
  const [addingDividend, setAddingDividend] = useState(false);
  const [addError, setAddError] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDividend, setSelectedDividend] = useState(null);
  const [updatedDividendAmount, setUpdatedDividendAmount] = useState("");
  const [updatedDividendDate, setUpdatedDividendDate] = useState("");
  const [updatingDividend, setUpdatingDividend] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIdOrName, setDeleteIdOrName] = useState("");
  const [deleteError, setDeleteError] = useState(null);

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchDividends();
    fetchEmployees();
  }, []);

  const fetchDividends = () => {
    // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
    const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

    if (!token) {
      console.error("Token không tồn tại");
      return;
    }

    fetch("http://localhost:5000/api/dividends", {
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
        setDividends(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchEmployees = () => {
    // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
    const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

    if (!token) {
      console.error("Token không tồn tại");
      return;
    }

    fetch("http://localhost:5000/api/employees", {
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
        console.log("✅ Dữ liệu nhận được:", data);
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const filteredDividend = dividends.filter((dividend) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      dividend.employeeName.toLowerCase().includes(keyword) ||
      dividend.dividendID.toString().includes(keyword) ||
      dividend.employeeID.toString().includes(keyword)
    );
  });

  const handleAddDividend = async (e) => {
    e.preventDefault();
    const { employeeID, dividendAmount, dividendDate } = newDividend;

    if (!employeeID || !dividendAmount || !dividendDate) {
      setAddError("Tất cả các trường thông tin đều phải điền.");
      return;
    }

    setAddingDividend(true);
    setAddError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }

      const rawAmount = dividendAmount.replace(/\./g, "");
      const numericAmount = parseInt(rawAmount, 10);

      const payload = {
        employeeID,
        dividendAmount: numericAmount,
        dividendDate,
      };

      const res = await fetch("http://localhost:5000/api/dividend/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể thêm cổ tức");
      }

      await res.json();
      setShowAddModal(false);
      setNewDividend({
        employeeID: "",
        dividendAmount: "",
        dividendDate: "",
      });
      fetchDividends();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddingDividend(false);
    }
  };

  const handleOpenUpdate = () => {
    if (!isUpdatingMode) {
      setIsUpdatingMode(true);
      return;
    }

    if (!selectedDividend) {
      setIsUpdatingMode(false);
      return;
    }

    setUpdatedDividendAmount(selectedDividend.dividendAmount);
    setUpdatedDividendDate(selectedDividend.dividendDate);
    setShowUpdateModal(true);
    setUpdateError(null);
  };

  const handleUpdateDividend = async (e) => {
    e.preventDefault();
    if (!updatedDividendAmount.trim()) {
      setUpdateError("Số tiền cổ tức không được để trống");
      return;
    }

    setUpdatingDividend(true);
    setUpdateError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await fetch(
        `http://localhost:5000/api/dividend/update/${selectedDividend.dividendID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dividendAmount: Number(updatedDividendAmount.replace(/\./g, "")),
            dividendDate: updatedDividendDate,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể cập nhật cổ tức");
      }

      await res.json();
      setShowUpdateModal(false);
      setSelectedDividend(null);
      setIsUpdatingMode(false);
      fetchDividends();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdatingDividend(false);
    }
  };

  const handleDeleteDividends = async () => {
    if (!deleteIdOrName.trim()) {
      setDeleteError("Vui lòng nhập ID hoặc cổ tức bạn muốn xóa");
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
        `http://localhost:5000/api/dividend/delete/${deleteIdOrName}`,
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

        throw new Error(errorData.message || "Không thể xóa cổ tức");
      }

      setDeleteIdOrName("");
      setShowDeleteModal(false);
      fetchDividends();
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="dividend-table-header">
        <div>Dividend list</div>

        {userRole === "admin" && (
          <div className="table-button-container">
            <button
              className="table-button add"
              onClick={() => setShowAddModal(true)}
            >
              <strong>Add</strong>
            </button>
            <button className="table-button update" onClick={handleOpenUpdate}>
              <strong>Update</strong>
            </button>
            <button
              className="table-button delete"
              onClick={() => setShowDeleteModal(true)}
            >
              <strong>Delete</strong>
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <SearchBar
          placeholder="Search by ID or Employee Name"
          onSearch={setSearchKeyword}
        />
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-dividend-modal">
            <h3>Add New Dividend</h3>
            {addError && <div className="error-message">{addError}</div>}
            <form onSubmit={handleAddDividend}>
              <div className="form-group-dividend">
                <label htmlFor="employ">Employee :</label>
                <select
                  value={newDividend.employeeID}
                  onChange={(e) =>
                    setNewDividend({
                      ...newDividend,
                      employeeID: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((employee) => (
                    <option
                      key={employee.employeeID}
                      value={employee.employeeID}
                    >
                      {`${employee.employeeID}. ${employee.fullName}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-dividend">
                <label htmlFor="dob">Dividend Date :</label>
                <input
                  type="date"
                  value={newDividend.dividendDate}
                  onChange={(e) =>
                    setNewDividend({
                      ...newDividend,
                      dividendDate: e.target.value,
                    })
                  }
                  placeholder="Dividend Date"
                  required
                />
              </div>
              <div
                className="form-group-dividend"
                style={{ position: "relative" }}
              >
                <label htmlFor="dividendAmount">Dividend Amount :</label>
                <input
                  type="text"
                  value={newDividend.dividendAmount}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = rawValue.replace(/[^\d]/g, "");
                    const formatted = numericValue.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      "."
                    );
                    setNewDividend({
                      ...newDividend,
                      dividendAmount: formatted,
                    });
                  }}
                  maxLength={20}
                  style={{ paddingRight: "50px" }}
                  required
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "gray",
                    fontSize: "12px",
                    pointerEvents: "none",
                  }}
                >
                  VNĐ
                </span>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewDividend(true);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={addingDividend}
                >
                  {addingDividend ? "Adding..." : "Add Dividend"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="add-dividend-modal">
            <h3>Update Dividend</h3>
            {updateError && <div className="error-message">{updateError}</div>}
            <form onSubmit={handleUpdateDividend}>
              <div className="form-group-dividend">
                <label>Dividend Date :</label>
                <input
                  type="date"
                  value={updatedDividendDate}
                  onChange={(e) => setUpdatedDividendDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-dividend">
                <label>Dividend Amount :</label>
                <input
                  type="text"
                  value={updatedDividendAmount}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = rawValue.replace(/[^\d]/g, "");
                    const formatted = numericValue.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      "."
                    );

                    setUpdatedDividendAmount(formatted);
                  }}
                  maxLength={20}
                  style={{ paddingRight: "50px" }}
                  required
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "gray",
                    fontSize: "12px",
                    pointerEvents: "none",
                  }}
                >
                  VNĐ
                </span>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedDividend(null);
                    setIsUpdatingMode(false);
                    setUpdatedDividendAmount("");
                    setUpdatedDividendDate("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={updatingDividend}
                >
                  {updatingDividend ? "Updating..." : "Update Dividend"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-dividend-modal">
            <h3>Delete Dividend</h3>
            {deleteError && <div className="error-message">{deleteError}</div>}
            <div className="form-group-dividend">
              <input
                type="text"
                value={deleteIdOrName}
                onChange={(e) => setDeleteIdOrName(e.target.value)}
                placeholder="Enter Dividend ID or Name"
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteIdOrName("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-submit"
                onClick={handleDeleteDividends}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bảng hiển thị dữ liệu cổ đông */}
      <div className="dividend-table-container" style={style}>
        <table className="dividend-table">
          <thead>
            <tr>
              {isUpdatingMode && <th>Select</th>}
              <th>Dividend ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Dividend Amount</th>
              <th>Dividend Date</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredDividend.map((dividend, index) => (
              <tr key={index} className="dividend-table-row">
                {isUpdatingMode && (
                  <td>
                    <input
                      type="checkbox"
                      checked={
                        selectedDividend?.dividendID === dividend.dividendID
                      }
                      onChange={() => {
                        if (
                          selectedDividend?.dividendID === dividend.dividendID
                        ) {
                          setSelectedDividend(null);
                        } else {
                          setSelectedDividend(dividend);
                        }
                      }}
                    />
                  </td>
                )}
                <td>{dividend.dividendID}</td>
                <td>{dividend.employeeID}</td>
                <td>{dividend.employeeName}</td>
                <td>{dividend.dividendAmount}</td>
                <td>{dividend.dividendDate}</td>
                <td>{dividend.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

HR_DividendTable.defaultProps = {
  style: {},
};

export default HR_DividendTable;
