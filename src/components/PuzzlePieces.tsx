import React, { DragEvent, TouchEvent } from 'react';
import { PuzzlePiece } from '../types/puzzle';

interface PuzzlePiecesProps {
  pieces: PuzzlePiece[];
  onDragStart: (e: DragEvent<HTMLImageElement>, piece: PuzzlePiece) => void;
  onDragEnd: (e: DragEvent<HTMLElement>) => void;
  onTouchStart: (e: TouchEvent<HTMLImageElement>, piece: PuzzlePiece) => void;
  onTouchEnd: (e: TouchEvent<HTMLImageElement>) => void;
}

const PuzzlePieces: React.FC<PuzzlePiecesProps> = React.memo(({
  pieces,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchEnd,
}) => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const handleDragStart = (e: DragEvent<HTMLImageElement>, piece: PuzzlePiece) => {
    if (!isTouchDevice) onDragStart(e, piece);
  };

  const handleDragEnd = (e: DragEvent<HTMLElement>) => {
    if (!isTouchDevice) onDragEnd(e);
  };

  const renderPuzzlePiece = (piece: PuzzlePiece) => (
    <img
      key={piece.id}
      src={piece.src}
      alt={`퍼즐 조각 ${piece.id}`}
      loading="lazy"
      draggable={!isTouchDevice}
      className="puzzle-piece"
      onDragStart={(e) => handleDragStart(e, piece)}
      onDragEnd={handleDragEnd}
      onTouchStart={(e) => onTouchStart(e, piece)}
      onTouchEnd={onTouchEnd}
    />
  );

  return (
    <div className="puzzle-pieces" role="region" aria-label="퍼즐 조각 영역">
      <h2 id="pieces-title">퍼즐 조각</h2>
      <div 
        className="pieces-grid"
        role="grid"
        aria-labelledby="pieces-title"
      >
        {pieces.map(renderPuzzlePiece)}
      </div>
    </div>
  );
});

PuzzlePieces.displayName = 'PuzzlePieces';

export default PuzzlePieces;
