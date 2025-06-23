import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Analytics from './components/Analytics';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    const token = localStorage.getItem('token') || 'fake-dev-token';

    return (
        <Router>
            {token && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/accounts" element={token ? <Accounts /> : <Navigate to="/login" />} />
                    <Route path="/analytics/:postId" element={token ? <Analytics /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;