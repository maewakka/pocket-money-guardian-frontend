import React, { useState } from 'react';
import axios from 'axios';
import styles from './SignUp.module.css';
import logo from '../../assets/logo.png'; // Placeholder for your logo image
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const naviagte = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    axios.post('/api/users/sign-up', {
        name,
        email,
        password,
    }).then((res) => {
        alert(res.data);
        naviagte('/login');
    }).catch((err) => {
        alert(err.response.data.message);
    });
  };

  

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <img src={logo} alt="Pocket Money Guardian Logo" className={styles.logo} />
        <h1 className={styles.serviceName}>Pocket Money Guardian</h1>
        <h2 className={styles.serviceNameKorean}>월급 지킴이</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="이메일"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="이름"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.signupButton}>가입하기</button>
        </form>
        <div className={styles.loginLink}>
          계정이 있으신가요? <a href="/login">로그인</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
