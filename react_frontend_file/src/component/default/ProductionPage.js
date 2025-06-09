// src/pages/ProductionPage.jsx
import React, { useState, useEffect } from 'react';
import styles from "../../css/ProductionPage.module.css";
import axios from 'axios';
import { API_BASE_URL } from './Api';

export default function ProductionPage() {
    const [selected, setSelected] = useState({ customer: null, number: null });
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState({});

    const isActionDisabled = !selected.customer || !selected.number || isProcessing;

    function handleProduce() { 
        if (!isActionDisabled){
            setIsProcessing(true)
        };
    }

    function handleCancel() {
        alert(JSON.stringify(selected, null, 2));
        setSelected({ customer: null, number: null });
        setSelectedCustomer(null);
        setSelectedFilm(null);
        setIsProcessing(false);
        setProgress(0);
    }

    function handleCustomerClick(name) {
        setSelectedCustomer(name);
        setSelectedFilm(null);
        setSelected(prev => ({ ...prev, customer: name }));
    }

    function handleFilmClick(film) {
        setSelectedFilm(film);
        setSelected(prev => ({ ...prev, number: film.id }));
    }

    useEffect(() => {
        if (!isProcessing) return;

        setProgress(0);

        const iv = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(iv);
                    return 100;
                }
                return p + 1;
            });
        }, 100);
        
        return () => clearInterval(iv);
    }, [isProcessing]);

    useEffect(() => {
        if (progress === 100) {            
            axios.post(`${API_BASE_URL}/backend/product/product_complate/`, selected)
            .then(res => {
                alert('생산 완료!');
                setIsProcessing(false);
                setProgress(0);
                setSelected({ customer: null, number: null });
                setSelectedFilm(null)
                setSelectedCustomer(null)
                
                
            }).catch(
                console.log('error')
            )
        }
    }, [progress]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/backend/product/product_load/`)
        .then(res => {
            console.log(res.data.film)
            setData(res.data.film)
            
        }).catch(
            console.log('error')
        )
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <div className={styles.box}>
                    <h3 style={{display : 'flex', position : 'fixed', width : '40%', height : '40px', backgroundColor : 'white'}}>주문자 리스트</h3>

                    <div style={{marginTop : '40px'}}>
                        {Object.keys(data).map(name => (
                            <div key={name} className={`${styles.item} ${selectedCustomer===name?styles.active:''}`} onClick={()=>handleCustomerClick(name)}>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={styles.box}>
                    <h3>필름 고유번호</h3>
                    {selectedCustomer ? data[selectedCustomer].map(f=>(
                        <div key={f.id} className={`${styles.item} ${selectedFilm?.id===f.id?styles.active:''}`} onClick={()=>handleFilmClick(f)}>
                            {f.name}
                        </div>
                    )) : <p>주문자를 선택해주세요.</p>}
                </div>
            </div>

            <div className={styles.detailBox}>
                <h3>상세 정보</h3>
                {selectedFilm ? (
                    <ul>
                        <li><strong>고유번호:</strong> {selectedFilm.id}</li>
                        <li><strong>필름 종류:</strong> {selectedFilm.type}</li>
                        <li><strong>필름 규격:</strong> {selectedFilm.spec}</li>
                        {/* <li><strong>수량:</strong> {selectedFilm.qty}</li> */}
                        <li><strong>주문자:</strong> {selectedCustomer}</li>
                    </ul>
                ) : <p>고유번호를 선택해주세요.</p>}
            </div>

            {isProcessing && (
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{width:`${progress}%`}}/>
                    <span className={styles.progressText}>{progress}%</span>
                </div>
            )}
            <div className={styles.actions}>
                <button className={styles.primaryButton} onClick={handleProduce} disabled={isActionDisabled}>생산하기</button>
                <button className={styles.secondaryButton} onClick={handleCancel} disabled={isProcessing}>취소하기</button>
            </div>
        </div>
    );
}
