import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import styles from './Modal.module.css';

const Modal = ({ handleUserJoin, setShowModal }) => {
    const [cookies] = useCookies(['jwt']);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const handleSearch = async () => {
        try {
            const token = cookies.jwt;
            const response = await axios.get(`/api/users?nickName=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCheckboxChange = (userId) => {
        setSelectedUserIds((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>사용자 검색</h2>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="닉네임 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearch} className={styles.searchButton}>검색</button>
                </div>
                <ul className={styles.userList}>
                    {users.map((user) => (
                        <li key={user.id} className={styles.userItem}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={selectedUserIds.includes(user.id)}
                                    onChange={() => handleCheckboxChange(user.id)}
                                    className={styles.checkbox}
                                />
                                {user.nickName}
                            </label>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => handleUserJoin(selectedUserIds)}
                    className={styles.joinButton}
                >
                    참여시키기
                </button>
                <button
                    onClick={() => setShowModal(false)}
                    className={styles.closeButton}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default Modal;
