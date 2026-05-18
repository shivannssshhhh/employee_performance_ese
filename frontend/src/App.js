import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import SearchFilter from './components/SearchFilter';
import AIRecommendation from './components/AIRecommendation';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';
import './App.css';

function MainLayout({ setAuth }) {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setAuth(false);
        localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="nav">
        <Link to="/"><button>Dashboard</button></Link>
        <Link to="/add"><button>Add Employee</button></Link>
        <Link to="/ai"><button>AI Recommendations</button></Link>
        <button onClick={handleLogout} className="danger-btn">Logout</button>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={
            <>
              <SearchFilter setEmployees={setEmployees} />
              <EmployeeList employees={employees} fetchEmployees={fetchEmployees} />
            </>
          } />
          <Route path="/add" element={<EmployeeForm fetchEmployees={fetchEmployees} />} />
          <Route path="/ai" element={<AIRecommendation />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  const [isAuth, setAuth] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Employee Performance AI</h1>
          <p>AI-driven analytics and recommendations</p>
        </header>
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/signup" element={<Signup setAuth={setAuth} />} />
          <Route path="/*" element={
            <ProtectedRoute isAuth={isAuth}>
              <MainLayout setAuth={setAuth} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
