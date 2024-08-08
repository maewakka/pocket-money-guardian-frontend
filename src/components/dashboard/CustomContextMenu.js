import React from 'react';
import styles from './CustomContextMenu.module.css';

const CustomContextMenu = ({ visible, x, y, onEdit, onDelete, onClose }) => {
    if (!visible) return null;

    const style = {
        top: y,
        left: x,
    };

    return (
        <div className={styles.contextMenu} style={style} onMouseLeave={onClose}>
            <button className={styles.menuItem} onClick={onEdit}>수정</button>
            <button className={styles.menuItem} onClick={onDelete}>삭제</button>
        </div>
    );
};

export default CustomContextMenu;
