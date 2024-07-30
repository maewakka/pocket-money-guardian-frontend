import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ChallengeList.module.css';
import { useCookies } from 'react-cookie';
import ChallengeModal from './ChallengeModal';
import useAxiosInstance from '../api/axiosInstance';

const ChallengeList = ({ setSelectedChallengeId }) => {
    const [cookies] = useCookies(['jwt']);
    const [challenges, setChallenges] = useState([]);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const axiosInstance = useAxiosInstance();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const token = cookies.jwt;
                const response = await axiosInstance.get('/api/challenge/own', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setChallenges(response.data);
                if (response.data.length > 0) {
                    setSelectedChallengeId(response.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching challenges:', error);
            }
        };

        fetchChallenges();
    }, [cookies, setSelectedChallengeId]);

    const handleAddChallenge = () => {
        setShowChallengeModal(true);
    };

    const handleChallengeCreated = async () => {
        setShowChallengeModal(false);
        try {
            const token = cookies.jwt;
            const response = await axios.get('/api/challenge/own', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setChallenges(response.data);
            if (response.data.length > 0) {
                setSelectedChallengeId(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
        }
    };

    return (
        <div className={styles.sidebar}>
            <h2>챌린지 리스트</h2>
            <ul className={styles.challengeList}>
                {challenges.map((challenge) => (
                    <li
                        key={challenge.id}
                        className={styles.challengeItem}
                        onClick={() => setSelectedChallengeId(challenge.id)}
                    >
                        {challenge.name}
                    </li>
                ))}
            </ul>
            <button onClick={handleAddChallenge} className={styles.addButton}>챌린지 추가</button>
            {showChallengeModal && (
                <ChallengeModal
                    setShowModal={setShowChallengeModal}
                    onChallengeCreated={handleChallengeCreated}
                />
            )}
        </div>
    );
};

export default ChallengeList;
