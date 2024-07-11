import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Auth.css';

const Login = ({ onLogin, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate for navigation

    const handleLogin = () => {
        
        console.log('Giriş denemesi başlatılıyor...');
        if (!email || !password) {
            setError('Lütfen tüm alanları doldurun.');
            setTimeout(()=>{
                setError('');
            },2000)
            return;
        }
        axios.post('http://localhost:5000/login', { email, password })
            .then(response => {
                // Başarılı giriş işlemi
                console.log('Giriş başarılı, response:', response.data);
                const { user } = response.data;
                onLogin(user); // onLogin fonksiyonu çağrılarak giriş başarılı şekilde gerçekleştiriliyor
                // Navigate to VideoStream page
                navigate('/video-stream');

                setTimeout(()=>{
                    setError('');
                },2000)
            })
            .catch(error => {
                // Hata durumu
                console.error('Login error:', error);
                setError(error.response ? error.response.data.message : error.message);

                setTimeout(() => {
                    setError('');
                }, 2000);
            });
    };

    const handleRegisterClick = () => {
        navigate('/register'); // Navigate to '/register' path
        if (typeof onRegisterClick === 'function') {
            onRegisterClick(); // Call onRegisterClick function if it's a function
        }
    };

    return (
        <div className="auth-container">
            <h2>Giriş Yap</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleLogin}>Giriş Yap</button>
            <button className="secondary" onClick={handleRegisterClick}>Üye Ol</button>
        </div>
    );
};

export default Login;
