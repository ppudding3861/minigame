// src/hooks/usePuzzleGame.ts
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
 board: Array(9).fill(null)
};

const API_ENDPOINTS = {
 UPLOAD: 'http://localhost:8080/api/upload',
 START_GAME: 'http://localhost:8080/api/start-game'
} as const;

export const usePuzzleGame = () => {
    const [gameState, setGameState] = useState<GameState>({
        image: null,
        pieces: [], // 빈 배열로 초기화되어야 함
        preview: "",
        isGameStarted: false,
        board: Array(9).fill(null)
      });
 const [isLoading, setIsLoading] = useState<LoadingState>({
   upload: false,
   gameStart: false
 });

 const handleImageUpload = useCallback(async (file: File) => {
   setIsLoading(prev => ({ ...prev, upload: true }));
   
   try {
     // 이미지 프리뷰 생성
     const previewPromise = new Promise<string>((resolve, reject) => {
       const reader = new FileReader();
       reader.onload = () => resolve(reader.result as string);
       reader.onerror = () => reject(new Error('Failed to read file'));
       reader.readAsDataURL(file);
     });

     // 이미지 업로드
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

     // 병렬로 처리
     const [preview, uploadResult] = await Promise.all([
       previewPromise, 
       uploadPromise
     ]);

     setGameState(prev => ({
       ...prev,
       image: file,
       preview
     }));

     console.log("Uploaded image:", uploadResult);
   } catch (error) {
     console.error("Upload error:", error);
     throw new Error("이미지 업로드 중 오류가 발생했습니다.");
   } finally {
     setIsLoading(prev => ({ ...prev, upload: false }));
   }
 }, []);

 const startGame = useCallback(async () => {
   setIsLoading(prev => ({ ...prev, gameStart: true }));
   
   try {
     const response = await fetch(API_ENDPOINTS.START_GAME);
     if (!response.ok) {
       throw new Error('게임 시작 실패');
     }
     
     const data = await response.json();
     
     setGameState(prev => ({
       ...prev,
       pieces: data.pieces,
       board: Array(9).fill(null),
       isGameStarted: true
     }));
   } catch (error) {
     console.error("Game start error:", error);
     throw new Error("게임 시작 중 오류가 발생했습니다.");
   } finally {
     setIsLoading(prev => ({ ...prev, gameStart: false }));
   }
 }, []);

 const checkCompletion = useCallback((currentBoard: (PuzzlePiece | null)[]) => {
   const isComplete = currentBoard.every((piece, index) => {
     if (!piece) return false;
     return (
       piece.correctX === index % 3 && 
       piece.correctY === Math.floor(index / 3)
     );
   });

   if (isComplete) {
     handleGameCompletion();
   }
 }, []);
 

 const handleGameCompletion = useCallback(() => {
   // TODO: 게임 완료 처리를 위한 API 호출 등 추가 가능
   alert("축하합니다! 퍼즐을 완성했습니다! 🎉");
 }, []);

 const setPieces = useCallback((pieces: PuzzlePiece[] | ((prev: PuzzlePiece[]) => PuzzlePiece[])) => {
    setGameState(prev => ({
      ...prev,
      pieces: Array.isArray(pieces) ? pieces : pieces(Array.isArray(prev.pieces) ? prev.pieces : [])
    }));
  }, []);

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
   checkCompletion
 };
};