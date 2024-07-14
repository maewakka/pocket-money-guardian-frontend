import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';
import logo from '../../assets/logo.png'; // Placeholder for your logo image
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/sign-in', {
                email,
                password,
            });
            console.log(response.data);
            // console.log('Login successful:', response.data);
            // Handle successful login, e.g., store token, redirect to another page
            // navigate('/dashboard'); // Example: redirect to dashboard after login
        } catch (error) {
            console.error('Login error:', error);
            // Handle login error, e.g., show error message
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <img src={logo} alt="Pocket Money Guardian Logo" className={styles.logo} />
                <h1 className={styles.serviceName}>Pocket Money Guardian</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="이메일"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className={styles.loginButton}>로그인</button>
                </form>
                <div className={styles.signupLink}>
                    계정이 없으신가요? <a href="/sign-up">가입하기</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
