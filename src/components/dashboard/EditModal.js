import React, { useState } from 'react';
import styles from './EditModal.module.css';
import useAxiosInstance from '../../api/axiosInstance';

const EditModal = ({ historyItem, setShowEditModal, fetchHistoryData }) => {
    const [content, setContent] = useState(historyItem.content);
    const [amount, setAmount] = useState(historyItem.amount);
    const axiosInstance = useAxiosInstance();

    const handleUpdate = async () => {
        try {
            await axiosInstance.put('/api/history/update', {
                historyId: historyItem.historyId,
                content,
                amount
            });
            setShowEditModal(false);
            fetchHistoryData();
        } catch (error) {
            console.error('Error updating history:', error);
            alert('내역 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>내역 수정</h2>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>내용:</label>
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>금액:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <button onClick={handleUpdate} className={styles.updateButton}>수정하기</button>
                <button onClick={() => setShowEditModal(false)} className={styles.closeButton}>닫기</button>
            </div>
        </div>
    );
};

export default EditModal;
