// components/PuzzleBoard.tsx
import React, { DragEvent, TouchEvent } from 'react';
import { PuzzlePiece } from '../types/puzzleType';

interface PuzzleBoardProps {
  board: (PuzzlePiece | null)[];
  onDragOver: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent, index: number) => void;
  onTouchDrop: (index: number) => void;
  onDragStartFromBoard: (e: DragEvent<HTMLDivElement>, piece: PuzzlePiece, index: number) => void;
  onTouchStartFromBoard: (e: TouchEvent<HTMLDivElement>, piece: PuzzlePiece, index: number) => void;
  onPieceClick: (piece: PuzzlePiece, index: number) => void;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  board,
  onDragOver,
  onDragLeave,
  onDrop,
  onTouchDrop,
  onDragStartFromBoard,
  onTouchStartFromBoard,
  onPieceClick,
}) => {
  const renderBoardCell = (piece: PuzzlePiece | null, index: number) => (
    <div
      key={`board-${piece?.id || 'empty'}-${index}`}
      className="relative w-full aspect-[1/1.8] bg-white flex items-center justify-center 
                border-none overflow-hidden touch-none hover:bg-gray-50 transition-colors"
      data-index={index}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      onTouchEnd={() => onTouchDrop(index)}
      onTouchMove={(e) => e.preventDefault()}
    >
      {piece && (
        <div
          className="absolute inset-0 w-full h-full touch-none"
          onClick={() => onPieceClick(piece, index)}
          onDragStart={(e) => onDragStartFromBoard(e, piece, index)}
          onTouchStart={(e) => onTouchStartFromBoard(e, piece, index)}
        >
          <img
            src={piece.src}
            alt={`배치된 조각 ${piece.id}`}
            className="w-full h-full object-cover touch-none
                      group-hover:scale-110 group-hover:shadow-lg group-hover:z-10 
                      transition-transform duration-200"
            draggable={false}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-[70%] bg-white p-[0.5vw] rounded-lg flex flex-col items-center touch-none">
      <h2 className="m-0 mb-[0.5vw] text-base font-medium">퍼즐판</h2>
      <div className="grid grid-cols-3 gap-px p-px w-full max-w-[400px] content-start bg-gray-300 aspect-[1/1.8] touch-none">
        {board.map(renderBoardCell)}
      </div>
    </div>
  );
};

export default React.memo(PuzzleBoard);