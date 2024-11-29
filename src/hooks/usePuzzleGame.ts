import React, { useState, useCallback } from 'react';
import { PuzzlePiece } from '../types/puzzle';

interface GameState {
  image: File | null;
  pieces: PuzzlePiece[];
  preview: string;
  isGameStarted: boolean;
  board: (PuzzlePiece | null)[];
}

interface LoadingState {
  upload: boolean;
  gameStart: boolean;
}

const INITIAL_GAME_STATE: GameState = {
  image: null,
  pieces: [],
  preview: "",
  isGameStarted: false,
  board: Array(9).fill(null),
};

const API_ENDPOINTS = {
  UPLOAD: process.env.REACT_APP_API_UPLOAD || 'http://localhost:8080/api/upload',
  START_GAME: process.env.REACT_APP_API_START_GAME || 'http://localhost:8080/api/start-game',
};

export const usePuzzleGame = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    upload: false,
    gameStart: false,
  });

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading((prev) => ({ ...prev, upload: true }));

    try {
      const previewPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const uploadPromise = (async () => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(API_ENDPOINTS.UPLOAD, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        return await response.json();
      })();

      const [preview, uploadResult] = await Promise.all([previewPromise, uploadPromise]);

      setGameState((prev) => ({
        ...prev,
        image: file,
        preview,
      }));

      console.log("Uploaded image:", uploadResult);
    } catch (error) {
      console.error("Upload error:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsLoading((prev) => ({ ...prev, upload: false }));
    }
  }, []);

  const startGame = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, gameStart: true }));

    try {
      const response = await fetch(API_ENDPOINTS.START_GAME);
      if (!response.ok) {
        throw new Error('게임 시작 실패');
      }

      const data = await response.json();

      setGameState((prev) => ({
        ...prev,
        pieces: data.pieces,
        board: Array(9).fill(null),
        isGameStarted: true,
      }));
    } catch (error) {
      console.error("Game start error:", error);
      alert("게임 시작 중 오류가 발생했습니다.");
    } finally {
      setIsLoading((prev) => ({ ...prev, gameStart: false }));
    }
  }, []);

  const checkCompletion = useCallback((currentBoard: (PuzzlePiece | null)[]) => {
    const isComplete = currentBoard.every((piece, index) => {
      if (!piece) return false;
      return piece.correctX === index % 3 && piece.correctY === Math.floor(index / 3);
    });

    if (isComplete) {
      handleGameCompletion();
    }
  }, []);

  const handleGameCompletion = useCallback(() => {
    alert("축하합니다! 퍼즐을 완성했습니다! 🎉");
    // TODO: Add more game completion logic
  }, []);

  const setPieces = useCallback(
    (pieces: PuzzlePiece[] | ((prev: PuzzlePiece[]) => PuzzlePiece[])) => {
      setGameState((prev) => ({
        ...prev,
        pieces: Array.isArray(pieces) ? pieces : pieces(prev.pieces),
      }));
    },
    []
  );

  const setBoard = useCallback((
    value: (PuzzlePiece | null)[] | ((prev: (PuzzlePiece | null)[]) => (PuzzlePiece | null)[])
  ) => {
    setGameState(prev => ({
      ...prev,
      board: typeof value === 'function' ? value(prev.board) : value
    }));
  }, []);

  return {
    ...gameState,
    isLoading,
    handleImageUpload,
    startGame,
    setPieces,
    setBoard,
    checkCompletion,
  };
};
