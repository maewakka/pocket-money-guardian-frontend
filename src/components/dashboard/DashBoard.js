import React, { useState } from 'react';
import ChallengeList from './ChallengeList';
import AllowanceTable from './AllowanceTable';
import styles from './DashBoard.module.css';

const DashBoard = () => {
    const [selectedChallengeId, setSelectedChallengeId] = useState(null);

    return (
        <div className={styles.containers}>
            <div className={styles.sidebar}>
                <ChallengeList setSelectedChallengeId={setSelectedChallengeId} />
            </div>
            <div className={styles.main}>
                {selectedChallengeId && <AllowanceTable selectedChallengeId={selectedChallengeId} />}
            </div>
        </div>
    );
};

export default DashBoard;
