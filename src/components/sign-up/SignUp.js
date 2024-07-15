import React, { useState } from 'react';
import axios from 'axios';
import styles from './SignUp.module.css';
import logo from '../../assets/logo.png'; // Placeholder for your logo image
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please verify your email before signing up.');
      return;
    }
    axios.post('/api/users/sign-up', {
      name,
      email,
      password,
    }).then((res) => {
      alert(res.data);
      navigate('/login');
    }).catch((err) => {
      alert(err.response.data.message);
    });
  };

  const sendVerificationCode = () => {
    axios.get('/api/users/code/send', {
      params: {email: email},
    }).then((res) => {
      alert(res.data);
      setIsVerificationSent(true);
    }).catch((err) => {
      alert(err.response.data.message);
    });
  };

  const verifyCode = () => {
    axios.get('/api/users/code/verify', {
      params: {email: email, code: verificationCode}
    }).then((res) => {
      alert(res.data);
      setIsVerified(true);
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
          <div className={styles.emailContainer}>
            <input
              type="email"
              placeholder="이메일"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" onClick={sendVerificationCode} className={styles.verifyButton}>인증번호 전송</button>
          </div>
          {isVerificationSent && (
            <div className={styles.verificationContainer}>
              <input
                type="text"
                placeholder="인증번호"
                className={styles.input}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button type="button" onClick={verifyCode} className={styles.verifyButton}>인증하기</button>
            </div>
          )}
          <input
            type="password"
            placeholder="비밀번호"
            className={styles.input_etc}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="이름"
            className={styles.input_etc}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
