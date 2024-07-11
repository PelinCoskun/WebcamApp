import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../assets/styles/App.css';
import Login from './Auth/Login';
import Register from './Auth/Register';
import VideoStream from './PhotoCapture/VideoStream';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegister = (username, password) => {
        axios.post('http://localhost:5000/register', { username, password })
            .then(response => {
                alert('Kayıt başarılı. Lütfen giriş yapın.');
                setIsRegistering(false); // Kayıt durumunu false yap
                setIsAuthenticated(false); // Kullanıcı doğrulama durumunu false yap
            })
            .catch(error => {
                console.error('Registration error:', error);
            });
    };

    const handleLogin = (user) => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} onRegisterClick={() => setIsRegistering(true)} />} />
                    <Route path="/register" element={<Register onRegister={handleRegister} onLogin={() => setIsRegistering(false)} />} />
                    <Route path="/video-stream" element={<VideoStream />} />
                    <Route path="/" element={
                        isAuthenticated ? (
                            <Navigate to="/video-stream" />
                        ) : (
                            <Login onLogin={handleLogin} onRegisterClick={() => setIsRegistering(true)} />
                        )
                     } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
