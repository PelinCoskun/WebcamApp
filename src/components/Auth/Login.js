import axios from 'axios';
import DOMPurify from 'dompurify'; // XSS koruması için DOMPurify kullanımı
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = ({ onLogin, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!email || !password) {
            setError('Lütfen tüm alanları doldurun.');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }

        // Kullanıcı girişlerini temizle
        const sanitizedEmail = DOMPurify.sanitize(email);
        const sanitizedPassword = DOMPurify.sanitize(password);

        axios.post('http://localhost:5000/login', { email: sanitizedEmail, password: sanitizedPassword })
            .then(response => {
                const { user } = response.data;
                onLogin(user); 
                navigate('/video-stream');
            })
            .catch(error => {
                setError('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin ve tekrar deneyin.');
                setTimeout(() => {
                    setError('');
                }, 2000);
            });
    };

    const handleRegisterClick = () => {
        navigate('/register'); 
        if (typeof onRegisterClick === 'function') {
            onRegisterClick(); 
        }
    };

    const handleForgotPasswordClick = () => {
        navigate('/new-password'); // Navigate to NewPasswordScreen
    };

    return (
        <div className="auth-container">
            <h2>Giriş Yap</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off" // Otomatik tamamlamayı kapat
            />
            <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off" // Otomatik tamamlamayı kapat
            />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleLogin}>Giriş Yap</button>
            <button className="secondary" onClick={handleRegisterClick}>Üye Ol</button>
            <button className="forgot-password" onClick={handleForgotPasswordClick}>
                Şifremi Unuttum
            </button>
        </div>
    );
};

export default Login;
