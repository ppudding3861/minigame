// src/hooks/usePuzzleGame.ts

import { useState, useCallback, useEffect } from 'react';
import { PuzzlePiece } from '../types/puzzleType';
import { useImageProcessor } from './useImageProcessor';

export const usePuzzleGame = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [board, setBoard] = useState<(PuzzlePiece | null)[]>(Array(9).fill(null));
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const { preview, pieces: processedPieces, processImage } = useImageProcessor();

  // processedPieces가 변경될 때마다 pieces 상태 업데이트
  useEffect(() => {
    if (processedPieces.length > 0) {
      setPieces(processedPieces);
    }
  }, [processedPieces]);

  const handleImageUpload = useCallback(async (file: File) => {
    setImage(file);
    await processImage(file);
  }, [processImage]);

  const startGame = useCallback(() => {
    setIsGameStarted(true);
  }, []);

  const checkCompletion = useCallback((currentBoard: (PuzzlePiece | null)[]) => {
    const isComplete = currentBoard.every((piece, index) => {
      if (!piece) return false;
      return piece.correctX === index % 3 && piece.correctY === Math.floor(index / 3);
    });

    if (isComplete) {
      alert("축하합니다! 퍼즐을 완성했습니다! 🎉");
    }
  }, []);

  return {
    image,
    pieces,
    preview,
    isGameStarted,
    board,
    handleImageUpload,
    startGame,
    setPieces,
    setBoard,
    checkCompletion,
  };
};