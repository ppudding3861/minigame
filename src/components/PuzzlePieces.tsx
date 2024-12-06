import React, { DragEvent, TouchEvent, useMemo } from 'react';
import { PuzzlePiece } from '../types/puzzleType';

interface PuzzlePiecesProps {
  pieces: PuzzlePiece[];
  onDragStart: (e: DragEvent<HTMLImageElement>, piece: PuzzlePiece) => void;
  onDragEnd: (e: DragEvent<HTMLElement>) => void;
  onTouchStart: (e: TouchEvent<HTMLImageElement>, piece: PuzzlePiece) => void;
  onTouchEnd: (e: TouchEvent<HTMLImageElement>) => void;
}

const PuzzlePieces: React.FC<PuzzlePiecesProps> = ({
  pieces,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchEnd,
}) => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Fisher-Yates 셔플 알고리즘을 사용하여 배열을 무작위로 섞습니다
  const shuffleArray = (array: PuzzlePiece[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // useMemo를 사용하여 컴포넌트가 리렌더링될 때마다 
  // 무작위로 섞이는 것을 방지합니다
  const shuffledPieces = useMemo(() => shuffleArray(pieces), [pieces]);

  const renderPuzzlePiece = (piece: PuzzlePiece, index: number) => (
    <div 
      key={`piece-${piece.id}-${index}`}
      className="aspect-[1/1.8] touch-none"
    >
      <img
        src={piece.src}
        alt={`퍼즐 조각 ${piece.id}`}
        loading="lazy"
        draggable={!isTouchDevice}
        className="w-full h-full object-cover rounded-lg cursor-grab touch-none 
                  hover:scale-110 hover:shadow-lg hover:z-10 
                  active:cursor-grabbing transition-all duration-200"
        onDragStart={(e) => onDragStart(e, piece)}
        onDragEnd={onDragEnd}
        onTouchStart={(e) => onTouchStart(e, piece)}
        onTouchEnd={onTouchEnd}
        
      />
    </div>
  );

  return (
    <div className="w-full bg-white p-[0.5vw] rounded-lg h-[55%] touch-none">
      <h2 className="m-0 mb-[0.5vw] text-base font-medium">퍼즐 조각</h2>
      <div className="grid grid-cols-3 gap-[0.5vw] w-full content-start touch-none">
        {shuffledPieces.map(renderPuzzlePiece)}
      </div>
    </div>
  );
};

export default React.memo(PuzzlePieces);