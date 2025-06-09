import React from 'react';
import styles from "../../css/Sidebar.module.css";
import logo from "../../DCU_Mark.png"

const pages = [
    { key: 'order', label: '필름 주문' },
    { key: 'production', label: '필름 생산' },
    { key: 'inspection', label: '필름 검사 및 확인' },
    { key: 'introduction', label: '정보' },
];

export default function Sidebar({ activePage, onSelect }) {
    return (
        <nav className={styles.sidebar} style={{display : 'flex', alignItems : 'center'}}>
            <img src={logo} style={{display : 'flex', height : '50px', marginBottom : '20px', marginTop : '20px'}} />
            
            {pages.map(page => (
                <button key={page.key} className={`${styles.button} ${activePage === page.key ? styles.active : ''}`} onClick={() => onSelect(page.key)}>
                    {page.label}
                </button>
            ))}
        </nav>
    );
}