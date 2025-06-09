// src/pages/OrderPage.jsx
import React, { useState } from 'react';
import styles from "../../css/OrderPage.module.css";
import axios from 'axios';
import { API_BASE_URL } from './Api.js';

const filmTypes = ['Type A', 'Type B', 'Type C', 'Type D'];
const filmSpecs = ['100x200', '200x300', '300x400', '4024x1700'];

export default function OrderPage() {
    const [selected, setSelected] = useState({ type: null, spec: null, customer: '' });
    const [activeField, setActiveField] = useState(null);
    const isOrderDisabled = !selected.type || !selected.spec || !selected.customer;

    function handleOptionSelect(field, option) { setSelected(prev => ({ ...prev, [field]: option })); setActiveField(null); }
    function handleCustomerChange(e) { setSelected(prev => ({ ...prev, customer: e.target.value })); }
    function handleClear(field, e) { e.stopPropagation(); setSelected(prev => ({ ...prev, [field]: field === 'customer' ? '' : null })); }
    function handleCancel() { setSelected({ type: null, spec: null, customer: '' }); setActiveField(null); }
    
    async function handleOrder() {
        axios.post(`${API_BASE_URL}/backend/order/film_order/`, selected)
            .then(res => {
                alert('주문 완료!');
                
                console.log(res.data)

                // 3) 확인(OK) 누른 뒤 상태 초기화
                setSelected({ type: null, spec: null, customer: '' });
                setActiveField(null)
            }).catch(err => {
                // 에러 발생 시
                console.error(err);
                alert(`주문 실패: ${err.message}`);
            });
      }

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.box}>
                    <div className={styles.field}>
                        <label>필름 종류</label>
                        <div className={styles.inputBox} onClick={()=>setActiveField('type')}>
                            <span>{selected.type||'선택하세요'}</span>
                            {selected.type && <button className={styles.clearBtn} onClick={e=>handleClear('type',e)}>×</button>}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>필름 규격</label>
                        <div className={styles.inputBox} onClick={()=>setActiveField('spec')}>
                            <span>{selected.spec||'선택하세요'}</span>
                            {selected.spec && <button className={styles.clearBtn} onClick={e=>handleClear('spec',e)}>×</button>}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>주문자</label>
                        <div className={styles.inputBox} style={{height : '52px'}}>
                            <input type="text" className={styles.customerInput} value={selected.customer} onChange={handleCustomerChange} placeholder="입력하세요" onFocus={()=>setActiveField(null)}/>
                            {selected.customer && <button className={styles.clearBtn} onClick={e=>handleClear('customer',e)}>×</button>}
                        </div>
                    </div>
                </div>

                <div className={styles.box}>
                    <h3 className={styles.boxTitle}>
                        {activeField==='type'?'필름 종류 선택':activeField==='spec'?'필름 규격 선택':'항목을 선택해주세요'}
                    </h3>

                    <div className={styles.optionsBox}>
                        {activeField==='type'&&filmTypes.map(opt=>(
                            <div key={opt} className={`${styles.optionItem} ${selected.type===opt?styles.selectedOption:''}`} onClick={()=>handleOptionSelect('type',opt)}>{opt}</div>
                        ))}

                        {activeField==='spec'&&filmSpecs.map(opt=>(
                            <div key={opt} className={`${styles.optionItem} ${selected.spec===opt?styles.selectedOption:''}`} onClick={()=>handleOptionSelect('spec',opt)}>{opt}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.primaryButton} onClick={handleOrder} disabled={isOrderDisabled}>주문하기</button>
                <button className={styles.secondaryButton} onClick={handleCancel}>취소하기</button>
            </div>
        </div>
    );
}
