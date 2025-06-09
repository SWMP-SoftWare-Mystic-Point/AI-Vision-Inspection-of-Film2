import React, { useState, useRef, useEffect } from 'react';
import styles from '../../css/FilmInspectionPage.module.css';
import axios from 'axios';
import { API_BASE_URL } from './Api';

export default function FilmInspectionPage() {
  // 이제 selectedFilms는 id와 product_image를 담은 객체 배열
  const [selectedFilms, setSelectedFilms] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  const [idOrder, setIdOrder] = useState([]);
  const [result, setResult] = useState([]);
  const [results, setResults] = useState({});
  const lastClickedIndex = useRef(null);

  // 객체 배열을 idOrder 기준으로 정렬
  function sortByOrder(arr) {
    return arr
      .slice()
      .sort((a, b) => idOrder.indexOf(a.id) - idOrder.indexOf(b.id));
  }

  function handleFilmClick(e, index) {
    e.preventDefault();
    const film = data[index];
    const exists = selectedFilms.some(f => f.id === film.id);
    let newSelected;

    if (e.ctrlKey) {
      // Ctrl 클릭: 토글
      if (exists) {
        newSelected = selectedFilms.filter(f => f.id !== film.id);
      } else {
        newSelected = [...selectedFilms, { id: film.id, product_image: film.product_image }];
      }

    } else if (e.shiftKey) {
      // Shift 클릭: 범위 선택
      if (exists) {
        newSelected = selectedFilms.filter(f => f.id !== film.id);
      } else if (lastClickedIndex.current !== null) {
        const start = Math.min(lastClickedIndex.current, index);
        const end = Math.max(lastClickedIndex.current, index);
        const range = data.slice(start, end + 1).map(f => ({ id: f.id, product_image: f.product_image }));
        newSelected = Array.from(
          new Map([
            ...selectedFilms.map(f => [f.id, f]),
            ...range.map(f => [f.id, f])
          ]).values()
        );
      } else {
        newSelected = [{ id: film.id, product_image: film.product_image }];
      }

    } else {
      // 일반 클릭: 단일 선택
      newSelected = [{ id: film.id, product_image: film.product_image }];
    }

    setSelectedFilms(sortByOrder(newSelected));
    lastClickedIndex.current = index;
    setCurrentIndex(0);
  }

  function handleSelectAll() {
    const all = idOrder.map(id => {
      const f = data.find(d => d.id === id);
      return { id, product_image: f.product_image };
    });
    setSelectedFilms(
      selectedFilms.length === all.length ? [] : all
    );
    setCurrentIndex(0);
  }

  const total = selectedFilms.length;
  function handlePrev() {
    setCurrentIndex(i => Math.max(0, i - 1));
  }
  function handleNext() {
    setCurrentIndex(i => Math.min(total - 1, i + 1));
  }

  const currentFilm =
    total > 0
      ? data.find(f => f.id === selectedFilms[currentIndex].id)
      : null;

  // function handleInspect() {
  //   if (selectedFilms.length === 0) return;

  //   // films 키로 객체 배열 전송
  //   axios.post(`${API_BASE_URL}/backend/inspection/predict/`, selectedFilms)
  //     .then(res => {
  //       setResult(res.data);
  //     })
  //     .catch(err => console.error(err));
  // }

  function handleInspect() {
    if (selectedFilms.length === 0) return;
  
    axios
      .post(`${API_BASE_URL}/backend/inspection/predict/`, selectedFilms)
      .then(res => {
        const { image_id, label, confidence } = res.data;

        const arrayData = res.data;
        
        const map = {};
        arrayData.forEach(item => {
          map[item.image_id] = {
            image_id: item.image_id,
            label: item.label,
            confidence: item.confidence
          };
      });
      setResults(map);
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/backend/inspection/production_load/`)
      .then(res => {
        setData(res.data.production);
        setIdOrder(res.data.production.map(f => f.id));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Film List */}
        <div className={styles.cloudBox}>
          <div className={styles.header} style={{display : 'flex', position : 'fixed', top : '30px', left : '255px', width : '40.5%', height : '60px', backgroundColor : 'white'}}>
            <h3 style={{margin : '0', marginLeft : '20px'}}>필름 리스트</h3>
            <button onClick={handleSelectAll}>전체 선택</button>
          </div>
          <div className={styles.list}>
            {data.map((film, idx) => (
              <div
                key={film.id}
                draggable={false}
                onDragStart={e => e.preventDefault()}
                className={`${styles.item} ${
                  selectedFilms.some(f => f.id === film.id) ? styles.active : ''
                }`}
                onClick={e => handleFilmClick(e, idx)}
              >
                {film.name}
              </div>
            ))}
          </div>
        </div>

        {/* 상세 정보, 사진 등은 기존과 동일 */}
        <div className={styles.cloudBox}>
          <h3>상세 정보</h3>
          {currentFilm ? (
            <ul>
              <li><strong>고유번호:</strong> {currentFilm.id}</li>
              <li><strong>필름 종류:</strong> {currentFilm.type}</li>
              <li><strong>필름 규격:</strong> {currentFilm.spec}</li>
              <li><strong>주문자:</strong> {currentFilm.order}</li>
            </ul>
          ) : (
            <p>선택 대기중</p>
          )}
        </div>
        <div className={styles.cloudBox}>
          <h3>원본 사진</h3>
          {currentFilm ? (
            <img
              src={`data:image/bmp;base64,${currentFilm.original}`}
              alt="original"
              className={styles.photo}
            />
          ) : (
            <p>선택 대기중</p>
          )}
        </div>
        <div className={styles.cloudBox}>
          <h3>검사 결과</h3>
          {currentFilm && results[currentFilm.id] ? (
            <ul>
              <li><strong>이미지 ID:</strong> {results[currentFilm.id].image_id}</li>
              <li><strong>불량 여부:</strong> {results[currentFilm.id].label}</li>
              <li><strong>신뢰도:</strong> {results[currentFilm.id].confidence}</li>
            </ul>
          ) : (
            <p>검사 전 또는 조회 불가</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button onClick={handlePrev} disabled={currentIndex <= 0}>◀</button>
        <span>{total > 0 ? `${currentIndex + 1}/${total}` : '0/0'}</span>
        <button onClick={handleNext} disabled={currentIndex >= total - 1}>▶</button>
      </div>

      {/* 검사 버튼 */}
      <div className={styles.actions}>
        <button onClick={handleInspect} disabled={total === 0}>검사</button>
      </div>
    </div>
  );
}
