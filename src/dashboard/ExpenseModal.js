import React, { useState } from 'react';
import styles from './ExpenseModal.module.css';

const ExpenseModal = ({ handleExpenseAdd, setShowModal }) => {
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
        handleExpenseAdd({ date, content, amount: parseInt(amount, 10) });
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>소비 추가</h2>
                <label>
                    날짜:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <label>
                    내용:
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <label>
                    금액:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <button onClick={handleSubmit} className={styles.addButton}>등록</button>
                <button onClick={() => setShowModal(false)} className={styles.closeButton}>닫기</button>
            </div>
        </div>
    );
};

export default ExpenseModal;
