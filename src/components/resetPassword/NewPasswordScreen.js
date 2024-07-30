import axios from 'axios'; // or your preferred HTTP client
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPasswordScreen.css'; // Assuming you have a CSS file for styling

const NewPasswordScreen = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isVerifyPasswordVisible, setIsVerifyPasswordVisible] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    const handleSendVerificationCode = async () => {
        if (!email) {
            alert('Lütfen e-posta adresini girin.');
            return;
        }
        try {
            const result = await axios.post('http://localhost:5000/api/send-verification-code', { email });
            if (result.data.message) {
                alert(result.data.message);
                setIsEmailSent(true);
            } else {
                alert(result.data.message);
            }
        } catch (error) {
            console.error('Doğrulama kodu gönderilirken hata oluştu:', error);
            alert('Doğrulama kodu gönderilirken bir hata oluştu.');
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            alert('Lütfen doğrulama kodunu girin.');
            return;
        }
    
        try {
            const result = await axios.post('http://localhost:5000/api/verify-code', {
                email,
                code: verificationCode // Ensure the correct field name is used
            });
            if (result.data.message) {
                alert('Doğrulama kodu doğru. Şimdi yeni şifrenizi belirleyebilirsiniz.');
                setIsCodeVerified(true);
            } else {
                alert(result.data.message);
            }
        } catch (error) {
            console.error('Doğrulama kodu doğrulanırken hata oluştu:', error);
            alert('Doğrulama kodu doğrulanırken bir hata oluştu.');
        }
    };
    

    const saveNewPassword = async () => {
        if (!email) {
            alert('Lütfen e-posta adresini girin.');
        } else if (!password) {
            alert('Lütfen yeni şifreyi girin.');
        } else if (!verifyPassword) {
            alert('Lütfen yeni şifreyi doğrulayın.');
        } else if (password !== verifyPassword) {
            alert('Şifreler eşleşmiyor. Lütfen kontrol edin.');
        } else {
            try {
                const result = await axios.post('http://localhost:5000/update-user', { email, password, code: verificationCode });
                if (result.data.message) {
                    alert(result.data.message);
                    navigate('/login');
                } else {
                    alert(result.data.message);
                }
            } catch (error) {
                console.error('Şifre güncellenirken hata oluştu:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert('Şifre güncellenirken bir hata oluştu.');
                }
            }
        }
    };
    
    return (
        <div className="container">
            <h2>Şifremi Unuttum</h2>
            <div className="input-container">
                <input
                    type="email"
                    placeholder="Email Adres"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="input"
                />
            </div>
            {isEmailSent && !isCodeVerified && (
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Doğrulama Kodu"
                        onChange={(e) => setVerificationCode(e.target.value)}
                        value={verificationCode}
                        className="input"
                    />
                </div>
            )}
            {isEmailSent && isCodeVerified && (
                <>
                    <div className="input-container">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Yeni Parola"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="input"
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type={isVerifyPasswordVisible ? 'text' : 'password'}
                            placeholder="Yeni Şifre Tekrar"
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            value={verifyPassword}
                            className="input"
                        />
                    </div>
                </>
            )}

            <button
                onClick={isEmailSent ? (isCodeVerified ? saveNewPassword : handleVerifyCode) : handleSendVerificationCode}
                className="button">
                {isEmailSent ? (isCodeVerified ? 'Kaydet' : 'Doğrulama Kodunu Onayla') : 'Doğrulama Kodu Gönder'}
            </button>
        </div>
    );
};

export default NewPasswordScreen;
