import React, { useEffect, useState } from "react";
import "../../styles/HumanResourceStyles/HR_EmployeeTable.css";
import SearchBar from "../General/SearchBar";
// import {ToastContainer} from "react-toastify"

const HR_EmployeeTable = ({ style }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    hireDate: "",
    departmentID: "",
    positionID: "",
    status: "Đang làm việc",
    role: "",
  });
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [addError, setAddError] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updatedDepartmentID, setUpdatedDepartmentID] = useState("");
  const [updatedPositionID, setUpdatedPositionID] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatingEmployee, setUpdatingEmployee] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIdOrName, setDeleteIdOrName] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [deleteStep, setDeleteStep] = useState("input"); // hoặc "confirm"
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchPositions();
  }, []);

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
        console.log("✅ Dữ liệu nhận được:", data);
        setPositions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const {
      fullName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      hireDate,
      departmentID,
      positionID,
      role,
    } = newEmployee;

    if (
      !fullName.trim() ||
      !dateOfBirth ||
      !gender ||
      !phoneNumber ||
      !email ||
      !hireDate ||
      !departmentID ||
      !positionID ||
      !role
    ) {
      setAddError("Tất cả các trường thông tin đều phải điền.");
      return;
    }

    setAddingEmployee(true);
    setAddError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await fetch("http://localhost:5000/api/employee/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể thêm nhân viên");
      }

      await res.json();
      setShowAddModal(false);
      setNewEmployee({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        email: "",
        hireDate: "",
        departmentID: "",
        positionID: "",
        status: "Đang làm việc",
        role: "",
      });
      fetchEmployees();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddingEmployee(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      employee.employeeID.toString().includes(keyword) ||
      employee.fullName.toLowerCase().includes(keyword) ||
      employee.departmentName?.toLowerCase().includes(keyword) ||
      employee.positionName?.toLowerCase().includes(keyword)
    );
  });

  const handleOpenUpdate = () => {
    if (!isUpdatingMode) {
      setIsUpdatingMode(true);
      return;
    }

    if (!selectedEmployee) {
      setIsUpdatingMode(false);
      return;
    }

    setUpdatedDepartmentID(selectedEmployee.departmentID || "");
    setUpdatedPositionID(selectedEmployee.positionID || "");
    setUpdatedStatus(selectedEmployee.status || "");
    setShowUpdateModal(true);
    setUpdateError(null);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!updatedDepartmentID || !updatedPositionID || updatedStatus === "") {
      setUpdateError(
        "Vui lòng điền đầy đủ thông tin phòng ban, chức vụ và trạng thái"
      );
      return;
    }

    setUpdatingEmployee(true);
    setUpdateError(null);

    try {
      // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
      const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }
      const res = await fetch(
        `http://localhost:5000/api/employee/update/${selectedEmployee.employeeID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            departmentID: updatedDepartmentID,
            positionID: updatedPositionID,
            status: updatedStatus,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể cập nhật nhân viên");
      }

      await res.json();
      setShowUpdateModal(false);
      setSelectedEmployee(null);
      setIsUpdatingMode(false);
      fetchEmployees(); // gọi lại danh sách nhân viên
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdatingEmployee(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deleteIdOrName.trim()) {
      setDeleteError("Vui lòng nhập ID hoặc Họ tên nhân viên muốn xóa");
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
        `http://localhost:5000/api/employee/delete/${deleteIdOrName}`,
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

        throw new Error(errorData.message || "Không thể xóa nhân viên");
      }

      setDeleteIdOrName("");
      setShowDeleteModal(false);
      setDeleteStep("input");
      fetchEmployees();
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
        `http://localhost:5000/api/employee/delete/${pendingDeleteId}?force=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Đã xóa nhân viên và dữ liệu liên quan.");
      setDeleteIdOrName("");
      setShowDeleteModal(false);
      setDeleteStep("input");
      fetchEmployees();
    } catch (err) {
      setDeleteError(err.message);
      setDeleteStep("input");
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
      <div className="employ-table-header">
        <div>Employee list</div>

        {/* Button add - thêm nhân viên và delete - xóa nhân viên */}
        <div className="table-button-container">
          <button
            className="table-button add"
            onClick={() => setShowAddModal(true)}
          >
            <strong>Add</strong>
          </button>
          <button
            className="table-button"
            onClick={() => handleOpenUpdate(employees)}
          >
            <strong>Update</strong>
          </button>
          {userRole === "admin" && (
            <button
              className="table-button delete"
              onClick={() => setShowDeleteModal(true)}
            >
              <strong>Delete</strong>
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <SearchBar
          placeholder="Search by EmployeeID or Name"
          onSearch={setSearchKeyword}
        />
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-employee-modal">
            <h3>Add New Employee</h3>
            {addError && <div className="error-message">{addError}</div>}
            <form onSubmit={handleAddEmployee}>
              <div
                className="form-group-employee"
                style={{ position: "relative" }}
              >
                <label htmlFor="fullName">Full Name :</label>
                <input
                  type="text"
                  value={newEmployee.fullName}
                  onChange={(e) => {
                    const rawValue = e.target.value;

                    // Cho phép chữ cái có dấu tiếng Việt, khoảng trắng, dấu gạch nối (-)
                    const cleanedValue = rawValue.replace(
                      /[^A-Za-zÀ-ỹà-ỹ\s-]/g,
                      ""
                    );

                    // Gán giá trị mới (sẽ tự cắt nếu >150 vì có maxLength)
                    setNewEmployee((prev) => ({
                      ...prev,
                      fullName: cleanedValue.slice(0, 150),
                    }));
                  }}
                  maxLength={150}
                  style={{ paddingRight: "40px" }}
                  required
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color:
                      (newEmployee.fullName?.length || 0) >= 150
                        ? "red"
                        : "gray",
                    fontSize: "12px",
                    pointerEvents: "none",
                  }}
                >
                  {150 - (newEmployee.fullName?.length || 0)}
                </span>
              </div>
              <div className="form-group-employee">
                <label htmlFor="dob">Date of Birth :</label>
                <input
                  type="date"
                  value={newEmployee.dateOfBirth}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      dateOfBirth: e.target.value,
                    })
                  }
                  placeholder="Date of Birth"
                  required
                />
              </div>
              <div className="form-group-employee">
                <label htmlFor="gender">Gender :</label>
                <select
                  value={newEmployee.gender}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, gender: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group-employee">
                <label htmlFor="phone">Phone :</label>
                <input
                  type="text"
                  value={newEmployee.phoneNumber}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      phoneNumber: e.target.value,
                    })
                  }
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="form-group-employee">
                <label htmlFor="email">Email :</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group-employee">
                <label htmlFor="hireDate">Hire Date :</label>
                <input
                  type="date"
                  value={newEmployee.hireDate}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, hireDate: e.target.value })
                  }
                  placeholder="Hire Date"
                  required
                />
              </div>
              <div className="form-group-employee">
                <label htmlFor="depart">Department :</label>
                <select
                  value={newEmployee.departmentID}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      departmentID: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {`${department.id}. ${department.departmentName}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-employee">
                <label htmlFor="position">Position :</label>
                <select
                  value={newEmployee.positionID}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      positionID: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Select Position --</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {`${position.id}. ${position.positionName}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-employee">
                <label htmlFor="status">Status :</label>
                <select
                  value={newEmployee.status}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, status: e.target.value })
                  }
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group-employee">
                <label htmlFor="role">Role :</label>
                <select
                  value={newEmployee.role}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, role: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                  <option value="payroll">Payroll</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewEmployee(true);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={addingEmployee}
                >
                  {addingEmployee ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="add-employee-modal">
            <h3>Update Employee Info</h3>
            {updateError && <div className="error-message">{updateError}</div>}
            <form onSubmit={handleUpdateEmployee}>
              <div className="form-group-employee">
                <label>Department</label>
                <select
                  className="select-trim"
                  value={updatedDepartmentID}
                  onChange={(e) => setUpdatedDepartmentID(e.target.value)}
                  required
                >
                  <option disabled value="">
                    -- Select Department --
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {`${department.id}. ${department.departmentName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-employee">
                <label>Position</label>
                <select
                  className="select-trim"
                  value={updatedPositionID}
                  onChange={(e) => setUpdatedPositionID(e.target.value)}
                  required
                >
                  <option disabled value="">
                    -- Select Position --
                  </option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {`${position.id}. ${position.positionName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-employee">
                <label>Status</label>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  required
                >
                  <option value="">-- Select status --</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedEmployee(null);
                    setIsUpdatingMode(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={updatingEmployee}
                >
                  {updatingEmployee ? "Updating..." : "Update Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-employee-modal">
            <h3>Delete Employee</h3>

            {deleteStep === "input" && (
              <>
                {deleteError && (
                  <div className="error-message">{deleteError}</div>
                )}
                <div className="form-group-employee">
                  <input
                    type="text"
                    value={deleteIdOrName}
                    onChange={(e) => setDeleteIdOrName(e.target.value)}
                    placeholder="Enter Employee ID or Name"
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
                    onClick={handleDeleteEmployee}
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
                    Nhân viên ID <b>{pendingDeleteId}</b> đang có dữ liệu ràng
                    buộc trong bảng <b>Dividend</b> hoặc <b>salaries</b>.
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

      {/* Bảng hiển thị dữ liệu nhân viên */}
      <div className="employ-table-container" style={style}>
        <div className="employ-table-wrapper">
          <table className="employ-table">
            <thead>
              <tr>
                {isUpdatingMode && <th>Select</th>}
                <th>ID</th>
                <th>Full name</th>
                <th>Date-Birth</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Hire-date</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={index} className="employ-table-row">
                  {isUpdatingMode && (
                    <td>
                      <input
                        type="checkbox"
                        checked={
                          selectedEmployee?.employeeID === employee.employeeID
                        }
                        onChange={() => {
                          if (
                            selectedEmployee?.employeeID === employee.employeeID
                          ) {
                            setSelectedEmployee(null);
                          } else {
                            setSelectedEmployee(employee);
                          }
                        }}
                      />
                    </td>
                  )}
                  <td>{employee.employeeID}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.dateOfBirth}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.email}</td>
                  <td>{employee.hireDate}</td>
                  <td className="cell" title={employee.departmentName}>
                    {employee.departmentName}
                  </td>
                  <td className="cell" title={employee.positionName}>
                    {employee.positionName}
                  </td>
                  <td>
                    <div
                      className={`enhanced-status-indicator ${
                        employee.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      <span className="status-dot"></span>
                      <span className="status-text">
                        {employee.status === "Active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td>{employee.createdAt}</td>
                  <td>{employee.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

HR_EmployeeTable.defaultProps = {
  style: {},
};

export default HR_EmployeeTable;
