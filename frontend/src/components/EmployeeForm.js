import React, { useState } from 'react';
import axios from 'axios';

const EmployeeForm = ({ fetchEmployees }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', skills: '', performanceScore: '', experience: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const payload = { ...formData, skills: skillsArray };
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/employees`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Employee added successfully!');
      setFormData({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
      fetchEmployees();
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="form-container dark-card">
      <h2>Add New Employee</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="employee-form">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
        <input name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} />
        <input name="performanceScore" type="number" min="0" max="100" placeholder="Performance Score (0-100)" value={formData.performanceScore} onChange={handleChange} required />
        <input name="experience" type="number" min="0" placeholder="Experience (years)" value={formData.experience} onChange={handleChange} required />
        <button type="submit" className="primary-btn">Add Employee</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
