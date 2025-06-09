import React, { useState } from 'react';
import styles from './Main.module.css';

export default function Main() {
  // 샘플 이미지 목록 (실제로는 props나 API로 가져올 수도 있음)
  const imageList = [
    { id: 1, name: 'G_001_08_22.bmp' },
    { id: 2, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    { id: 3, name: 'G_001_08_22.bmp' },
    
  ];

  // 선택된 이미지 상태
  const [selectedImage, setSelectedImage] = useState(imageList[0].name);

  // 업로드 버튼 클릭 핸들러(예시)
  function handleUploadClick() {
    alert('이미지 업로드 클릭');
  }

  // 일괄 검사하기 버튼 클릭 핸들러(예시)
  function handleBatchCheck() {
    alert('일괄 검사하기 클릭');
  }

  // 드롭다운에서 이미지 선택 시
  function handleSelectChange(e) {
    setSelectedImage(e.target.value);
  }

  // 검사하기 버튼 클릭(예시)
  function handleCheck() {
    alert(`${selectedImage} 검사하기`);
  }

  return (
    <div className={styles.container}>
      {/* 상단 영역 */}
      <div>
        <button className={styles.batchCheckBtn} onClick={handleBatchCheck}>
          <p style={{fontSize : '16px'}}>일괄 검사하기</p>
        </button>
        
        <div className={styles.topArea}>
          <div className={styles.uploadWrapper} onClick={handleUploadClick}>
            <div className={styles.folderIcon}>📁</div>
            <p className={styles.uploadText}>이미지 업로드 하기</p>
          </div>

          <div className={styles.thumbnailList}>
            {imageList.map((img) => (
              <div className={styles.thumbnailItem} key={img.id}>
                <div style={{display : 'flex', minWidth : '140px', height : '90px', margin : '15px'}}>
                  <img className={styles.thumbnailPlaceholder} src={img.name} />
                </div>
                
                <div style={{display : 'flex', width : '99.8%', justifyContent : 'center'}}>
                  <p style={{display : 'flex', position : "sticky", margin : '0', bottom : '15px'}}>{img.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.contentArea}>
        {/* 왼쪽: 이미지 선택 & 미리보기 */}
        <div className={styles.leftPanel}>
          <div className={styles.selectorBar}>
            <select value={selectedImage} onChange={handleSelectChange} className={styles.selectBox} >
              {imageList.map((img) => (
                <option key={img.id} value={img.name}>
                  {img.name}
                </option>
              ))}
            </select>
            <button className={styles.checkBtn} onClick={handleCheck}>
              검사 하기
            </button>
          </div>

          <div className={styles.imagePreview}>
            {/* 선택된 이미지 미리보기 (파일명만 표시) */}
            <div className={styles.previewPlaceholder}>{selectedImage}</div>
          </div>
        </div>

        {/* 오른쪽: 검사 상세 내용 */}
        <div className={styles.detailPanel}>
          <div className={styles.detailTitle}>검사 상세 내용</div>
          <div className={styles.detailContent}>
            {/* 검사 결과 표시 영역 (예시) */}
            결과가 여기에 표시됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}


