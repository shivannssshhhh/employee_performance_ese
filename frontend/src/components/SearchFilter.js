import React, { useState } from 'react';
import axios from 'axios';

const SearchFilter = ({ setEmployees }) => {
  const [department, setDepartment] = useState('');
  const [minScore, setMinScore] = useState('');
  const [skills, setSkills] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (minScore) params.append('minScore', minScore);
      if (skills) params.append('skills', skills);

      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/employees/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    setDepartment('');
    setMinScore('');
    setSkills('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-container dark-card">
      <h3>Filter Employees</h3>
      <form onSubmit={handleSearch} className="search-form">
        <input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
        <input type="number" placeholder="Min Score" value={minScore} onChange={e => setMinScore(e.target.value)} />
        <input placeholder="Skills (comma sep)" value={skills} onChange={e => setSkills(e.target.value)} />
        <button type="submit" className="primary-btn">Search</button>
        <button type="button" onClick={handleClear} className="secondary-btn">Clear</button>
      </form>
    </div>
  );
};

export default SearchFilter;
