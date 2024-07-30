import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import styles from './ChallengeModal.module.css';
import useAxiosInstance from '../api/axiosInstance';

const ChallengeModal = ({ setShowModal, onChallengeCreated }) => {
    const [cookies] = useCookies(['jwt']);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [initialDay, setInitialDay] = useState('');
    const axiosInstance = useAxiosInstance();

    const handleSubmit = async () => {
        try {
            const token = cookies.jwt;
            await axiosInstance.post('/api/challenge/create', {
                name,
                limit: parseInt(limit, 10),
                initialDay: parseInt(initialDay, 10)
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onChallengeCreated();
        } catch (error) {
            console.error('Error creating challenge:', error);
        }
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>챌린지 추가</h2>
                <label>
                    이름:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <label>
                    일일한도:
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <label>
                    초기화일자:
                    <input
                        type="number"
                        value={initialDay}
                        onChange={(e) => setInitialDay(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <button onClick={handleSubmit} className={styles.addButton}>등록</button>
                <button onClick={() => setShowModal(false)} className={styles.closeButton}>닫기</button>
            </div>
        </div>
    );
};

export default ChallengeModal;
