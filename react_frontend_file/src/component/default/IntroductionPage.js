import React, { useState, useRef, useEffect } from 'react';
import styles from '../../css/IntroductionPage.module.css';

export default function IntroductionPage(){
    return(
        <div className={styles.cloudBox}>
            <p classNamee={styles.introduction_font}> 팀명: SWMP</p>
            <p classNamee={styles.introduction_font}> 프로젝트명: 디스플레이 패널 부에 사용되는 기능성 필름의 AI비전검사</p>
            <p classNamee={styles.introduction_font}> 개요: 디스플레이 패널부에 사용되는 기능성 필름을 웹 인터페이스를 통해 사용자가 주문, 생산, 검사 전과정을 관리하고, YoloV11 기반의 AI 비전 검사 기술을 활용하여, 생산 공정 후 필름 이미지를 검사하여 불량 여부를 판단하는 통합 솔루션을 제공</p>
            
            <p classNamee={styles.introduction_font}>기술 스텍</p>
            <ul>
                <li>프론트엔드 프레임워크: React</li>
                <li>백엔드 프레임워크: Django, REST framework</li>
                <li>데이터베이스: SQLite</li>
                <li>머신러닝: YoloV11</li>
            </ul>

            <p classNamee={styles.introduction_font}> 팀원</p>
            
            <ul>
              <li>윤요한 | 팀장 | 백엔드, 프론트엔드</li>
              <li>권상록 | 팀원 | 백엔드, 프론트엔드</li>
              <li>장민수 | 팀원 | 데이터 수집, 전처리</li>
              <li>김우진 | 팀원 | AI</li>
              <li>임현준 | 팀원 | AI</li>
              <li>조명재 | 팀원 | AI</li>
            </ul>

        </div>
    )
}