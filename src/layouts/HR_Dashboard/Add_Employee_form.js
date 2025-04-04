import React, { useState, useEffect } from 'react';
import './Add_Employee_form.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    departmentId: '',
    jobTitle: '',
    jobId: '',
    salary: '',
    hireDate: '',
    description: '',
    profilePicture: null,
    status: 'active',
  });
  
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 0 });

  // Fetch departments and jobs when component mounts
  useEffect(() => {
    fetchDepartments();
    fetchJobs();
  }, []);

  // Update salary range when job is selected
  useEffect(() => {
    if (formData.jobId) {
      const selectedJob = jobs.find(job => job.job_id.toString() === formData.jobId);
      if (selectedJob) {
        setSalaryRange({
          min: selectedJob.min_salary,
          max: selectedJob.max_salary
        });
      }
    }
  }, [formData.jobId, jobs]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments');
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job positions');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear any previous error/success messages
    setError('');
    setSuccess('');
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    const selectedDepartment = departments.find(dept => dept.department_id.toString() === departmentId);
    
    setFormData({
      ...formData,
      departmentId: departmentId,
      department: selectedDepartment ? selectedDepartment.department_name : ''
    });
  };

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    const selectedJob = jobs.find(job => job.job_id.toString() === jobId);
    
    setFormData({
      ...formData,
      jobId: jobId,
      jobTitle: selectedJob ? selectedJob.job_title : '',
      // Optionally set a default salary based on the job's min salary
      salary: selectedJob ? selectedJob.min_salary.toString() : ''
    });
  };

  const handleImageUpload = (file) => {
    setFormData({ ...formData, profilePicture: file });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.departmentId) return 'Department is required';
    if (!formData.jobId) return 'Job title is required';
    if (!formData.salary) return 'Salary is required';
    if (!formData.hireDate) return 'Hire date is required';
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Invalid email format';
    
    // Validate salary (must be a number and within job's salary range)
    const selectedJob = jobs.find(job => job.job_id.toString() === formData.jobId);
    if (selectedJob) {
      const salaryNum = parseFloat(formData.salary);
      if (isNaN(salaryNum)) return 'Salary must be a valid number';
      if (salaryNum < selectedJob.min_salary) {
        return `Salary must be at least ${selectedJob.min_salary}`;
      }
      if (salaryNum > selectedJob.max_salary) {
        return `Salary cannot exceed ${selectedJob.max_salary}`;
      }
    }
    
    return null; // No validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    
    try {
      // Create employee object based on database schema
      const employeeData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        hire_date: formData.hireDate,
        department_id: parseInt(formData.departmentId),
        job_id: parseInt(formData.jobId),
        salary: parseFloat(formData.salary),
        status: formData.status
      };
      
      // API call to add employee to database
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }
      
      const result = await response.json();
      
      // Handle profile picture upload if provided
      if (formData.profilePicture) {
        const imageFormData = new FormData();
        imageFormData.append('profile_image', formData.profilePicture);
        imageFormData.append('employee_id', result.employee_id);
        
        const imageResponse = await fetch('/api/employee/profile-image', {
          method: 'POST',
          body: imageFormData
        });
        
        if (!imageResponse.ok) {
          console.warn('Failed to upload profile image, but employee was added');
        }
      }
      
      setSuccess(`Employee ${formData.firstName} ${formData.lastName} added successfully!`);
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        departmentId: '',
        jobTitle: '',
        jobId: '',
        salary: '',
        hireDate: '',
        description: '',
        profilePicture: null,
        status: 'active'
      });
      
    } catch (err) {
      console.error('Error adding employee:', err);
      setError(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="top-section">
        <div className="name-input-section">
          <div className="icon-container">
            <img src="https://dashboard.codeparrot.ai/api/image/Z-k65Xn5m-GBkPDa/custome.png" alt="User icon" className="user-icon" />
          </div>
          <div className="inputs-container">
            <div className="input-group">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="name-input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="name-input"
                required
              />
            </div>
          </div>
        </div>
        <div className="profile-picture-section">
          <div 
            className="upload-container"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleImageUpload(e.dataTransfer.files[0]);
            }}
          >
            {formData.profilePicture ? (
              <div className="preview-container">
                <img 
                  src={URL.createObjectURL(formData.profilePicture)} 
                  alt="Profile" 
                  className="profile-preview"
                />
                <button 
                  type="button" 
                  className="delete-button" 
                  onClick={() => handleImageUpload(null)}
                >
                  Delete
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <img src="https://dashboard.codeparrot.ai/api/image/Z-k65Xn5m-GBkPDa/group-10.png" alt="Upload" />
                </div>
                <div className="upload-text">
                  <p>Click to upload or drag and drop</p>
                  <p className="file-types">SVG, PNG, JPG or GIF (max. 800 x 400px)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="file-input"
                />
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="email-phone-section">
        <div className="input-group">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-k65Xn5m-GBkPDa/custome-2.png" alt="Email icon" className="icon" />
          <label className="label">Email address</label>
          <input 
            type="email"
            className="input-field"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>
        
        <div className="input-group">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-k65Xn5m-GBkPDa/custome-3.png" alt="Phone icon" className="icon phone-icon" />
          <label className="label">Phone number</label>
          <input 
            type="tel"
            className="input-field"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>
      
      <div className="department-job-section">
        <div className="input-group">
          <label className='department'>Department</label>
          <select
            className="input-field"
            value={formData.departmentId}
            onChange={handleDepartmentChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="input-group">
          <label className='job-title'>Job title</label>
          <select
            className="input-field input-jobTitle"
            value={formData.jobId}
            onChange={handleJobChange}
            required
          >
            <option value="">Select Job Title</option>
            {jobs.map(job => (
              <option key={job.job_id} value={job.job_id}>
                {job.job_title}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="salary-hire-date-section">
        <div className="input-group">
          <label className='salary'>Salary</label>
          <input
            type="number"
            value={formData.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            placeholder="Enter salary"
            className="input-field"
            required
            min={salaryRange.min}
            max={salaryRange.max}
          />
          {formData.jobId && (
            <small className="salary-range-info">
              Range: {salaryRange.min} - {salaryRange.max}
            </small>
          )}
        </div>
        <div className="input-group">
          <label className='hire-date'>Hire date</label>
          <input
            type="date"
            value={formData.hireDate}
            onChange={(e) => handleInputChange('hireDate', e.target.value)}
            className="input-field input-hireDay"
            required
          />
        </div>
      </div>
      
      <div className="short-description-section">
        <div className="description-label">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-k65Xn5m-GBkPDa/pencil.png" alt="pencil" className="pencil-icon" />
          <span>Short description</span>
        </div>
        <textarea 
          className="description-input"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="......."
        />
      </div>
      
      <button 
        type="submit"
        className="add-employee-button"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add employee'}
      </button>
    </form>
  );
};

export default EmployeeForm;