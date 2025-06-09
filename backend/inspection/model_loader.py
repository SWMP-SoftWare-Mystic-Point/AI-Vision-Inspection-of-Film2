# inference/model_loader.py
from pathlib import Path
import torch
from ultralytics import YOLO

WEIGHTS = Path(__file__).resolve().parent.parent / "weights" / "best.pt"
DEVICE  = "cuda" if torch.cuda.is_available() else "cpu"

_model = None      # 모듈 전역 변수(프로세스당 1개)

def get_model():
    """메모리에 이미 있으면 그대로, 없으면 로드해서 반환."""
    global _model
    if _model is None:
        _model = YOLO(str(WEIGHTS)).to(DEVICE)
        _model.fuse()            # Conv+BN 합치기 ─ 선택
        
    return _model
