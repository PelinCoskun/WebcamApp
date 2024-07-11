import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            // Simple client-side validation
            if (!name || !email || !password) {
                setError('Lütfen tüm alanları doldurun.');
                clearFeedback();
                return;
            }

            const response = await axios.post('http://localhost:5000/register', {
                name: name,
                email: email,
                password: password,
                type: 'user'
            });

            // Clear input fields and set success message
            setName('');
            setEmail('');
            setPassword('');
            setError('');
            setSuccess('Kayıt başarılı!');

            // Handle successful registration
            onRegister(response.data);

            // Clear feedback after 2 seconds and navigate to login
            setTimeout(() => {
                clearFeedback();
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Register error:', error);
            if (error.response && error.response.data.message === 'Kullanıcı zaten var') {
                setError('Kullanıcı zaten var');
            } else {
                setError('Kayıt sırasında bir hata oluştu.');
            }
            setSuccess(''); // Clear success message if there's an error

            // Clear feedback after 2 seconds
            clearFeedback();
        }
    };

    const clearFeedback = () => {
        setTimeout(() => {
            setError('');
            setSuccess('');
        }, 2000);
    };

    return (
        <div className="auth-container">
            <h2>Üye Ol</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <input
                type="text"
                placeholder="İsim"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
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
            <button onClick={handleRegister}>Kayıt Ol</button>
        </div>
    );
};

export default Register;
