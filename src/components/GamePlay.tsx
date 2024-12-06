// components/GamePlay.tsx
import React, { DragEvent, TouchEvent, useState, useCallback, useEffect, useRef } from 'react';
import PuzzlePieces from "./PuzzlePieces";
import PuzzleBoard from "./PuzzleBoard";
import { PuzzlePiece } from "../types/puzzleType";

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
  const draggedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    if (isTouchDevice) {
      document.addEventListener('touchmove', preventDefaultTouch as any, { passive: false });
      document.addEventListener('touchstart', preventDefaultTouch as any, { passive: false });
    }

    return () => {
      if (isTouchDevice) {
        document.removeEventListener('touchmove', preventDefaultTouch as any);
        document.removeEventListener('touchstart', preventDefaultTouch as any);
      }
    };
  }, [isTouchDevice]);

  const resetDraggedElement = useCallback(() => {
    if (draggedElementRef.current) {
      draggedElementRef.current.style.opacity = '1';
      draggedElementRef.current.style.transform = 'none';
      draggedElementRef.current = null;
    }
  }, []);

  const handlePieceMovement = useCallback((piece: PuzzlePiece, index: number | null) => {
    if (!piece) return;
  
    if (index !== null) {
      // 보드로 이동
      setBoard(prev => {
        const newBoard = [...prev];
        const existingPiece = newBoard[index];
        
        if (existingPiece) {
          setPieces(current => current.filter(p => p.id !== piece.id).concat(existingPiece));
        } else {
          setPieces(current => current.filter(p => p.id !== piece.id));
        }
        
        newBoard[index] = piece;
        checkCompletion(newBoard);
        return newBoard;
      });
    } else {
      // pieces 배열로 이동
      setBoard(prev => prev.map(p => p?.id === piece.id ? null : p));
      setPieces(prev => {
        if (prev.some(p => p.id === piece.id)) return prev;
        return [...prev, piece];
      });
    }
  }, [setPieces, setBoard, checkCompletion]);

  const handleDragStart = useCallback((e: DragEvent<HTMLImageElement>, piece: PuzzlePiece) => {
    if (isTouchDevice) return;
    
    const target = e.currentTarget;
    draggedElementRef.current = target;
    setDraggedPiece(piece);
    
    const img = new Image();
    img.src = piece.src;
    e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
    e.dataTransfer.setData('application/json', JSON.stringify(piece));
    
    target.style.opacity = '0.5';
    target.style.transform = 'scale(1.05)';
  }, [isTouchDevice]);

  const handleDragEnd = useCallback((e: DragEvent<HTMLElement>) => {
    resetDraggedElement();
    setDraggedPiece(null);
  }, [resetDraggedElement]);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLImageElement>, piece: PuzzlePiece) => {
    if (!isTouchDevice || e.cancelable === false) return;
    
    const target = e.currentTarget;
    draggedElementRef.current = target;
    setDraggedPiece(piece);
    
    target.style.opacity = '0.5';
    target.style.transform = 'scale(1.05)';
  }, [isTouchDevice]);

  const handleTouchEnd = useCallback((e: TouchEvent<HTMLImageElement>) => {
    if (!isTouchDevice || !draggedPiece || e.cancelable === false) return;
    
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const boardCell = element?.closest('[data-index]') as HTMLElement | null;
    
    if (boardCell) {
      const index = parseInt(boardCell.dataset.index || '-1');
      if (index >= 0) {
        handlePieceMovement(draggedPiece, index);
      }
    }
    
    resetDraggedElement();
    setDraggedPiece(null);
    e.preventDefault();
  }, [isTouchDevice, draggedPiece, handlePieceMovement, resetDraggedElement]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    const cell = (e.target as HTMLElement).closest('[data-index]');
    if (cell) {
      cell.classList.add('bg-gray-100');
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    const cell = (e.target as HTMLElement).closest('[data-index]');
    if (cell) {
      cell.classList.remove('bg-gray-100');
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent, index: number) => {
    e.preventDefault();
    
    try {
      const pieceData = e.dataTransfer.getData('application/json');
      const piece = JSON.parse(pieceData) as PuzzlePiece;
      handlePieceMovement(piece, index);
    } catch (error) {
      console.error('Drop handling error:', error);
    }

    setDraggedPiece(null);
    const cells = document.querySelectorAll('[data-index]');
    cells.forEach(cell => cell.classList.remove('bg-gray-100'));
  }, [handlePieceMovement]);

  const handlePieceClick = useCallback((piece: PuzzlePiece, index: number) => {
    if (isTouchDevice) return;
    
    // 보드에서 해당 조각을 제거
    setBoard(prev => {
      const newBoard = [...prev];
      newBoard[index] = null;
      return newBoard;
    });
    
    // pieces 배열에 추가
    setPieces(prev => [...prev, piece]);
  }, [isTouchDevice]);

  const handleDragStartFromBoard = useCallback((e: DragEvent<HTMLDivElement>, piece: PuzzlePiece, index: number) => {
    if (isTouchDevice) return;
    handleDragStart(e as any, piece);
    handlePieceMovement(piece, null);
  }, [isTouchDevice, handleDragStart, handlePieceMovement]);

  const handleTouchStartFromBoard = useCallback((e: TouchEvent<HTMLDivElement>, piece: PuzzlePiece, index: number) => {
    if (!isTouchDevice) return;
    handleTouchStart(e as any, piece);
    handlePieceMovement(piece, null);
  }, [isTouchDevice, handleTouchStart, handlePieceMovement]);

  return (
    <div className="flex gap-[1vw] w-full flex-1 touch-none select-none">
      <div className="w-[25%] flex flex-col gap-[1vw] h-full"> 
        <div className="w-full bg-white p-[0.5vw] rounded-lg h-[40%]"> 
          <h2 className="m-0 mb-[0.5vw] text-base font-medium">원본</h2>
          <img 
            src={preview} 
            alt="원본 이미지" 
            className="w-full h-[calc(100%-30px)] object-contain rounded"
            draggable={false}
          />
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
        onTouchDrop={(index) => draggedPiece && handlePieceMovement(draggedPiece, index)}
        onDragStartFromBoard={handleDragStartFromBoard}
        onTouchStartFromBoard={handleTouchStartFromBoard}
        onPieceClick={handlePieceClick}
      />
    </div>
  );
};

export default React.memo(GamePlay);