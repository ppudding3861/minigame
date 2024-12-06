// src/hooks/useImageProcessor.ts

import { useState, useCallback } from 'react';
import { PuzzlePiece } from '../types/puzzleType';

const TARGET_WIDTH = 520;
const TARGET_HEIGHT = 940;

export const useImageProcessor = () => {
  const [preview, setPreview] = useState<string>("");
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);

  const processImage = useCallback(async (file: File) => {
    // 이미지를 Base64로 변환
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    // 이미지 리사이징 및 크롭
    const img = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = base64;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // 타겟 비율에 맞게 크롭할 영역 계산
    const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
    const imgRatio = img.width / img.height;
    
    let sWidth, sHeight, sx, sy;
    if (imgRatio > targetRatio) {
      sHeight = img.height;
      sWidth = sHeight * targetRatio;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.width;
      sHeight = sWidth / targetRatio;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }

    // 리사이징된 이미지 생성
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    
    // 프리뷰 이미지 설정
    setPreview(canvas.toDataURL('image/png'));

    // 퍼즐 조각 생성 (3x3)
    const pieceWidth = TARGET_WIDTH / 3;
    const pieceHeight = TARGET_HEIGHT / 3;
    const newPieces: PuzzlePiece[] = [];

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceWidth;
        pieceCanvas.height = pieceHeight;
        const pieceCtx = pieceCanvas.getContext('2d')!;

        // 조각 이미지 추출
        pieceCtx.drawImage(
          canvas,
          x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight,
          0, 0, pieceWidth, pieceHeight
        );

        newPieces.push({
          id: y * 3 + x,
          src: pieceCanvas.toDataURL('image/png'),
          correctX: x,
          correctY: y
        });
      }
    }

    setPieces(newPieces);
  }, []);

  return {
    preview,
    pieces,
    processImage
  };
};