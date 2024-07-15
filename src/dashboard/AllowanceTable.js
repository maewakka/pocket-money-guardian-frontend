import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AllowanceTable.module.css';
import { useCookies } from 'react-cookie';
import Modal from './Modal';
import ExpenseModal from './ExpenseModal';

const AllowanceTable = ({ selectedChallengeId }) => {
    const [cookies] = useCookies(['jwt']);
    const [challengeDetails, setChallengeDetails] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            try {
                const token = cookies.jwt;
                const response = await axios.get(`/api/challenge/${selectedChallengeId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setChallengeDetails(response.data);
                if (response.data.participants.length > 0) {
                    setSelectedParticipant(response.data.participants[0].id);
                }
            } catch (error) {
                console.error('Error fetching challenge details:', error);
            }
        };

        if (selectedChallengeId) {
            fetchChallengeDetails();
        }
    }, [cookies, selectedChallengeId]);

    useEffect(() => {
        const fetchHistoryData = async () => {
            if (selectedParticipant && selectedChallengeId) {
                try {
                    const token = cookies.jwt;
                    const response = await axios.post('/api/history/list', {
                        userId: selectedParticipant,
                        challengeId: selectedChallengeId,
                        year,
                        month
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setHistoryData(response.data);
                } catch (error) {
                    console.error('Error fetching history data:', error);
                }
            }
        };

        fetchHistoryData();
    }, [cookies, selectedParticipant, selectedChallengeId, year, month]);

    const handleUserJoin = async (selectedUserIds) => {
        try {
            const token = cookies.jwt;
            await axios.post('/api/challenge/join', {
                userIds: selectedUserIds,
                challengeId: selectedChallengeId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShowUserModal(false);
            const response = await axios.get(`/api/challenge/${selectedChallengeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setChallengeDetails(response.data);
        } catch (error) {
            console.error('Error joining user to challenge:', error);
        }
    };

    const handleExpenseAdd = async (expenseData) => {
        try {
            const token = cookies.jwt;
            await axios.post('/api/history/register', {
                ...expenseData,
                challengeId: selectedChallengeId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShowExpenseModal(false);
            const response = await axios.post('/api/history/list', {
                userId: selectedParticipant,
                challengeId: selectedChallengeId,
                year,
                month
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setHistoryData(response.data);
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    return (
        <div className={styles.main}>
            {challengeDetails && (
                <>
                    <div className={styles.challengeInfo}>
                        <h2>{challengeDetails.name}</h2>
                        <div className={styles.infoRow}>
                            <p>일일한도: <span className={styles.highlight}>{challengeDetails.limit}원</span></p>
                            <p>초기화일자: <span className={styles.highlight}>{challengeDetails.initialDay}일</span></p>
                            <label className={styles.selectLabel}>
                                연도:
                                <select value={year} onChange={(e) => setYear(e.target.value)} className={styles.select}>
                                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </label>
                            <label className={styles.selectLabel}>
                                월:
                                <select value={month} onChange={(e) => setMonth(e.target.value)} className={styles.select}>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className={styles.header}>
                        <div className={styles.personTabs}>
                            {challengeDetails.participants.map((participant) => (
                                <button
                                    key={participant.id}
                                    className={styles.personTab}
                                    onClick={() => setSelectedParticipant(participant.id)}
                                >
                                    {participant.nickName}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowUserModal(true)} className={styles.addPersonButton}>+</button>
                    </div>
                </>
            )}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>날짜</th>
                            <th>사용 금액</th>
                            <th>남은 금액</th>
                            <th>내역</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.usedAmount}</td>
                                <td>{entry.remainingAmount}</td>
                                <td>
                                    <ul>
                                        {entry.dateHistory.map((history, idx) => (
                                            <li key={idx}>{history.content} - {history.amount}원</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => setShowExpenseModal(true)} className={styles.addExpenseButton}>소비 추가</button>
            {showUserModal && <Modal handleUserJoin={handleUserJoin} setShowModal={setShowUserModal} />}
            {showExpenseModal && <ExpenseModal handleExpenseAdd={handleExpenseAdd} setShowModal={setShowExpenseModal} />}
        </div>
    );
};

export default AllowanceTable;
