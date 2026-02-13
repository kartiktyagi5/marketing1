import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Survey from './pages/Survey';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Recommendations from './pages/Recommendations';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <NavLink to="/" className="nav-logo" style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'Playfair Display' }}>
                    Clicks vs Bricks
                </NavLink>
                <ul className="nav-links">
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="/about">About Study</NavLink></li>
                    <li><NavLink to="/survey">Survey</NavLink></li>
                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="/analysis">Analysis</NavLink></li>
                    <li><NavLink to="/recommendations">Recommendations</NavLink></li>
                </ul>
            </div>
        </nav>
    );
}

function App() {
    useEffect(() => {
        if (!localStorage.getItem('survey_responses')) {
            const initialData = [
                { age: '18-30', gender: 'Male', occupation: 'Student', d_trust: 4, d_appeal: 5, d_intent: 4, o_trust: 3, o_appeal: 2, o_intent: 3, habit_social: 'High', habit_tv: 'Low' },
                { age: '31-50', gender: 'Female', occupation: 'Professional', d_trust: 3, d_appeal: 4, d_intent: 3, o_trust: 5, o_appeal: 4, o_intent: 4, habit_social: 'Medium', habit_tv: 'Medium' },
                { age: '50+', gender: 'Male', occupation: 'Retired', d_trust: 2, d_appeal: 2, d_intent: 2, o_trust: 5, o_appeal: 5, o_intent: 5, habit_social: 'Low', habit_tv: 'High' },
                { age: '18-30', gender: 'Female', occupation: 'Student', d_trust: 5, d_appeal: 5, d_intent: 5, o_trust: 2, o_appeal: 3, o_intent: 2, habit_social: 'High', habit_tv: 'Low' },
                { age: '31-50', gender: 'Male', occupation: 'Self-employed', d_trust: 4, d_appeal: 3, d_intent: 4, o_trust: 4, o_appeal: 4, o_intent: 3, habit_social: 'Medium', habit_tv: 'Low' },
            ];
            localStorage.setItem('survey_responses', JSON.stringify(initialData));
        }
    }, []);

    return (
        <Router>
            <div className="app-wrapper">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/survey" element={<Survey />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                    </Routes>
                </main>
                <footer style={{ textAlign: 'center', padding: '2rem', color: '#718096', borderTop: '1px solid var(--border-color)' }}>
                    <p>&copy; 2026 MBA Research Project - Marketing Analytics Platform</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
