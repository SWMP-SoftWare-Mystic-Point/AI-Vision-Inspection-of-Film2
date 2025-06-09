#!/usr/bin/env python
"""
infer.py
────────────────────────────────────────────
YOLO-v11 분류 모델 단일 이미지 추론 스크립트
입력 : --image <경로>
출력 : {"label":"normal","confidence":0.97}

필수 파일
  • best.pt            : 학습 완료 가중치
  • class_names.txt    : 한 줄당 클래스 이름 (index 순서)
"""

import argparse, json, sys
from pathlib import Path
from PIL import Image
import torch
from ultralytics import YOLO


def load_class_names(txt_path: Path) -> list[str]:
    """class_names.txt → ['normal', 'defect'] …"""
    with open(txt_path, "r", encoding="utf-8") as f:
        return [ln.strip() for ln in f if ln.strip()]


def predict(model_path: Path, names_path: Path, image_path: Path, device: str = "cuda") -> dict:
    class_names = load_class_names(names_path)
    device = device if torch.cuda.is_available() and device.startswith("cuda") else "cpu"

    model = YOLO(str(model_path)).to(device).eval()

    img = Image.open(image_path).convert("RGB")

    with torch.inference_mode():
        result = model(img, verbose=False)[0]          # batch=1
        conf, idx = result.probs.max(dim=0)            # 최고 확률 하나
        return {
            "label": class_names[int(idx)],
            "confidence": float(conf)
        }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="🌄 입력 이미지 경로")
    parser.add_argument("--model", default="best.pt", help="🧩 가중치(.pt) 경로")
    parser.add_argument("--names", default="class_names.txt", help="🗂 클래스 이름 txt")
    parser.add_argument("--device", default="cuda", help="cuda | cpu")
    args = parser.parse_args()

    output = predict(
        model_path=Path(args.model),
        names_path=Path(args.names),
        image_path=Path(args.image),
        device=args.device,
    )

    json.dump(output, sys.stdout, ensure_ascii=False, indent=2)
    print()  # 개행


if __name__ == "__main__":
    main()
