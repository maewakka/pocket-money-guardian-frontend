import React, { useState } from 'react';
import ChallengeList from './ChallengeList';
import AllowanceTable from './AllowanceTable';
import styles from './DashBoard.module.css';

const DashBoard = () => {
    const [selectedChallengeId, setSelectedChallengeId] = useState(null);

    return (
        <div className={styles.container}>
            <ChallengeList setSelectedChallengeId={setSelectedChallengeId} />
            {selectedChallengeId && <AllowanceTable selectedChallengeId={selectedChallengeId} />}
        </div>
    );
};

export default DashBoard;
