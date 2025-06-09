import React, { useState } from 'react';
import OrderPage from '../default/OrderPage';
import ProductionPage from '../default/ProductionPage';
import Sidebar from '../default/Sidebar';
import styles from "../../css/Capstone.module.css";
import FilmInspectionPage from '../default/FilmInspectionPage';
import IntroductionPage from '../default/IntroductionPage';

export default function Capstone() {
    const [activePage, setActivePage] = useState('order');

    function renderPage() {
        switch (activePage) {
            case 'order':
                return <OrderPage />;
            case 'production':
                return <ProductionPage />;
            case 'inspection':
                return <FilmInspectionPage />;
            case 'introduction':
                return <IntroductionPage />;
            default:
                return <div>페이지를 선택해주세요.</div>;
        }
    }

    return (
        <div className={styles.container}>
            <Sidebar activePage={activePage} onSelect={setActivePage} />

            <div style={{display : 'flex', flexDirection : 'column', width : '100%'}}>
                <main className={styles.mainContent}>
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}


