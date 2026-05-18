import React from 'react';
import axios from 'axios';

const EmployeeList = ({ employees, fetchEmployees }) => {
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (err) {
      alert('Error deleting employee');
    }
  };

  return (
    <div className="list-container">
      <h2>Employee Directory</h2>
      {employees.length === 0 ? <p>No employees found.</p> : (
        <div className="grid">
          {employees.map(emp => (
            <div key={emp._id} className="card dark-card">
              <h3>{emp.name}</h3>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Dept:</strong> {emp.department}</p>
              <p><strong>Score:</strong> <span className="score-badge">{emp.performanceScore}/100</span></p>
              <p><strong>Experience:</strong> {emp.experience} yrs</p>
              <p><strong>Skills:</strong> {emp.skills.join(', ')}</p>
              <button onClick={() => handleDelete(emp._id)} className="danger-btn">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
