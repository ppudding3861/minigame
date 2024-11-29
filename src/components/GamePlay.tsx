// src/components/GamePlay.tsx

import React, { DragEvent, TouchEvent, useState, useCallback } from 'react';
import PuzzlePieces from "./PuzzlePieces";
import PuzzleBoard from "./PuzzleBoard";
import { PuzzlePiece } from "../types/puzzle";

interface GamePlayProps {
  pieces: PuzzlePiece[];
  preview: string;
  board: (PuzzlePiece | null)[];
  setPieces: React.Dispatch<React.SetStateAction<PuzzlePiece[]>>;
  setBoard: React.Dispatch<React.SetStateAction<(PuzzlePiece | null)[]>>;
  checkCompletion: (board: (PuzzlePiece | null)[]) => void;
}

const GamePlay: React.FC<GamePlayProps> = ({
 pieces,
 preview,
 board,
 setPieces,
 setBoard,
 checkCompletion,
}) => {
 const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
 const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

 const handlePieceMovement = useCallback((piece: PuzzlePiece, index: number | null) => {
   if (index !== null) {
     // 보드의 특정 위치로 이동
     const newBoard = [...board];
     const existingPiece = newBoard[index];
     
     if (existingPiece) {
       setPieces(prev => [...prev, existingPiece]);
     }
     
     newBoard[index] = piece;
     setBoard(newBoard);
     setPieces(prev => prev.filter(p => p.id !== piece.id));
     checkCompletion(newBoard);
   } else {
     // pieces 배열로 이동
     setPieces(prev => [...prev, piece]);
   }
 }, [board, setPieces, setBoard, checkCompletion]);

 // 드래그 관련 핸들러
 const handleDragStart = useCallback((e: DragEvent<HTMLImageElement>, piece: PuzzlePiece) => {
   if (isTouchDevice) return;
   setDraggedPiece(piece);
   const img = new Image();
   img.src = piece.src;
   e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
   e.dataTransfer.setData('application/json', JSON.stringify(piece));
   e.currentTarget.style.opacity = '0.5';
 }, [isTouchDevice]);

 const handleDragEnd = useCallback((e: DragEvent<HTMLElement>) => {
   if (isTouchDevice) return;
   e.currentTarget.style.opacity = '1';
   setDraggedPiece(null);
 }, [isTouchDevice]);

 const handleDragOver = useCallback((e: DragEvent) => {
   e.preventDefault();
   const cell = (e.target as HTMLElement).closest('.board-cell');
   if (cell) {
     cell.classList.add('drag-over');
   }
 }, []);

 const handleDragLeave = useCallback((e: DragEvent) => {
   const cell = (e.target as HTMLElement).closest('.board-cell');
   if (cell) {
     cell.classList.remove('drag-over');
   }
 }, []);

 // 터치 관련 핸들러
 const handleTouchStart = useCallback((e: TouchEvent<HTMLImageElement>, piece: PuzzlePiece) => {
   if (!isTouchDevice) return;
   setDraggedPiece(piece);
   e.currentTarget.style.opacity = '0.5';
 }, [isTouchDevice]);

 const handleTouchEnd = useCallback((e: TouchEvent<HTMLImageElement>) => {
   if (!isTouchDevice || !draggedPiece) return;
   
   const touch = e.changedTouches[0];
   const element = document.elementFromPoint(touch.clientX, touch.clientY);
   const boardCell = element?.closest('.board-cell') as HTMLElement | null;
   
   if (boardCell) {
     const index = parseInt(boardCell.getAttribute('data-index') || '-1');
     if (index >= 0) {
       handlePieceMovement(draggedPiece, index);
     }
   }
   
   setDraggedPiece(null);
   e.currentTarget.style.opacity = '1';
 }, [isTouchDevice, draggedPiece, handlePieceMovement]);

 // 보드 관련 핸들러
 const handleDrop = useCallback((e: DragEvent, index: number) => {
   if (isTouchDevice) return;
   e.preventDefault();
   
   try {
     const pieceData = e.dataTransfer.getData('application/json');
     const piece = JSON.parse(pieceData) as PuzzlePiece;
     handlePieceMovement(piece, index);
   } catch (error) {
     console.error('Drop handling error:', error);
   }

   setDraggedPiece(null);
   const cells = document.querySelectorAll('.board-cell');
   cells.forEach(cell => cell.classList.remove('drag-over'));
 }, [isTouchDevice, handlePieceMovement]);

 const handlePieceClick = useCallback((piece: PuzzlePiece, index: number) => {
   if (isTouchDevice) return;
   
   const newBoard = [...board];
   newBoard[index] = null;
   setBoard(newBoard);
   setPieces(prev => [...prev, piece]);
 }, [isTouchDevice, board, setPieces, setBoard]);

 const handleDragStartFromBoard = useCallback((e: DragEvent<HTMLDivElement>, piece: PuzzlePiece, index: number) => {
   if (isTouchDevice) return;
   setDraggedPiece(piece);
   
   const img = new Image();
   img.src = piece.src;
   e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
   e.dataTransfer.setData('application/json', JSON.stringify(piece));
   
   const newBoard = [...board];
   newBoard[index] = null;
   setBoard(newBoard);
   
   handlePieceMovement(piece, null);
   e.currentTarget.style.opacity = '0.5';
 }, [isTouchDevice, board, handlePieceMovement]);

 const handleTouchStartFromBoard = useCallback((e: TouchEvent<HTMLDivElement>, piece: PuzzlePiece, index: number) => {
   if (!isTouchDevice) return;
   setDraggedPiece(piece);
   
   const newBoard = [...board];
   newBoard[index] = null;
   setBoard(newBoard);
   
   handlePieceMovement(piece, null);
   e.currentTarget.style.opacity = '0.5';
 }, [isTouchDevice, board, handlePieceMovement]);

 return (
   <div className="game-play-container">
     <div className="left-section">
       <div className="original-image">
         <h2>원본</h2>
         <img src={preview} alt="Original" />
       </div>
       <PuzzlePieces
         pieces={pieces}
         onDragStart={handleDragStart}
         onDragEnd={handleDragEnd}
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}
       />
     </div>
     <PuzzleBoard
       board={board}
       onDragOver={handleDragOver}
       onDragLeave={handleDragLeave}
       onDrop={handleDrop}
       onTouchDrop={(index) => handlePieceMovement(draggedPiece!, index)}
       onDragStartFromBoard={handleDragStartFromBoard}
       onTouchStartFromBoard={handleTouchStartFromBoard}
       onPieceClick={handlePieceClick}
     />
   </div>
 );
};

export default GamePlay;