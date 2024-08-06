import React, { useState, useEffect } from 'react';
import styles from './AllowanceTable.module.css';
import { useCookies } from 'react-cookie';
import Modal from './Modal';
import ExpenseModal from './ExpenseModal';
import EditModal from './EditModal';
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import useAxiosInstance from '../../api/axiosInstance';

const MENU_ID = "contextmenu";

const AllowanceTable = ({ selectedChallengeId }) => {
    const { show } = useContextMenu({ id: MENU_ID });
    const [cookies] = useCookies(['jwt']);
    const [challengeDetails, setChallengeDetails] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [contextMenuHistoryId, setContextMenuHistoryId] = useState(null);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const axiosInstance = useAxiosInstance();

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/challenge/${selectedChallengeId}`);
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
    }, [selectedChallengeId]);

    const fetchHistoryData = async () => {
        if (selectedParticipant && selectedChallengeId) {
            try {
                const response = await axiosInstance.post('/api/history/list', {
                    userId: selectedParticipant,
                    challengeId: selectedChallengeId,
                    year,
                    month
                });
                setHistoryData(response.data);
            } catch (error) {
                console.error('Error fetching history data:', error);
            }
        }
    };

    useEffect(() => {
        fetchHistoryData();
    }, [selectedParticipant, selectedChallengeId, year, month]);

    const handleUserJoin = async (selectedUserIds) => {
        try {
            await axiosInstance.post('/api/challenge/join', {
                userIds: selectedUserIds,
                challengeId: selectedChallengeId
            });
            setShowUserModal(false);
            const response = await axiosInstance.get(`/api/challenge/${selectedChallengeId}`);
            setChallengeDetails(response.data);
        } catch (error) {
            console.error('Error joining user to challenge:', error);
        }
    };

    const handleExpenseAdd = async (expenseData) => {
        try {
            await axiosInstance.post('/api/history/register', {
                ...expenseData,
                challengeId: selectedChallengeId
            });
            setShowExpenseModal(false);
            fetchHistoryData();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleExpenseDelete = async ({ props }) => {
        const confirmation = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmation) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/history/${props.historyId}`);
            fetchHistoryData();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleExpenseEdit = async ({ props }) => {
        const historyItem = historyData.flatMap(entry => entry.dateHistory).find(item => item.historyId === props.historyId);
        if (historyItem) {
            setSelectedHistoryItem(historyItem);
            setShowEditModal(true);
        }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('ko-KR') + '원';
    };

    const handleContextMenu = (event, historyId) => {
        event.preventDefault();
        setContextMenuHistoryId(historyId);
        show({
            event,
            props: { historyId }
        });
    };

    const totalUsedAmount = historyData.reduce((total, entry) => total + entry.usedAmount, 0);
    const totalRemainingAmount = historyData.reduce((total, entry) => total + entry.remainingAmount, 0);

    return (
        <>
            {challengeDetails && (
                <>
                    <div className={styles.challengeInfo}>
                        <h2>{challengeDetails.name}</h2>
                        <div className={styles.infoRow}>
                            <div className={styles.leftInfo}>
                                <p>일일한도: <span className={styles.highlight}>{formatCurrency(challengeDetails.limit)}</span></p>
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
                            <div className={styles.rightInfo}>
                                <p>총 사용 금액: <span className={styles.highlight}>{formatCurrency(totalUsedAmount)}</span></p>
                                <p>총 남은 금액: <span className={styles.highlight}>{formatCurrency(totalRemainingAmount)}</span></p>
                            </div>
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
                            <th className={styles.dateColumn}>날짜</th>
                            <th className={styles.amountColumn}>사용 금액</th>
                            <th className={styles.remainingColumn}>남은 금액</th>
                            <th className={styles.detailsColumn}>내용</th>
                            <th className={styles.priceColumn}>금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.map((entry, index) => (
                            <React.Fragment key={index}>
                                <tr className={styles.dateRow}>
                                    <td className={styles.dateColumn} rowSpan={entry.dateHistory.length + 1 || 2}>{entry.date}</td>
                                    <td className={styles.amountColumn} rowSpan={entry.dateHistory.length + 1 || 2}>{formatCurrency(entry.usedAmount)}</td>
                                    <td className={styles.remainingColumn} rowSpan={entry.dateHistory.length + 1 || 2}>{formatCurrency(entry.remainingAmount)}</td>
                                    {entry.dateHistory.length === 0 && (
                                        <>
                                            <td className={styles.detailsColumn}></td>
                                            <td className={styles.priceColumn}></td>
                                        </>
                                    )}
                                </tr>
                                {entry.dateHistory.map((history, idx) => (
                                    <React.Fragment key={history.historyId}>
                                        <tr onContextMenu={(e) => handleContextMenu(e, history.historyId)}>
                                            <td className={styles.detailsColumn}>{history.content}</td>
                                            <td className={styles.priceColumn}>{formatCurrency(history.amount)}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <Menu id={MENU_ID}>
                <Item onClick={handleExpenseDelete}>삭제</Item>
                <Item onClick={handleExpenseEdit}>수정</Item>
            </Menu>
            {showEditModal && <EditModal historyItem={selectedHistoryItem} setShowEditModal={setShowEditModal} fetchHistoryData={fetchHistoryData} />}
            <button onClick={() => setShowExpenseModal(true)} className={styles.addExpenseButton}>소비 추가</button>
            {showUserModal && <Modal handleUserJoin={handleUserJoin} setShowModal={setShowUserModal} />}
            {showExpenseModal && <ExpenseModal handleExpenseAdd={handleExpenseAdd} setShowModal={setShowExpenseModal} />}
        </>
    );
};

export default AllowanceTable;
