// src/components/PuzzlePieces.tsx
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

  const renderPuzzlePiece = (piece: PuzzlePiece) => {
    const pieceEventHandlers = {
      onDragStart: isTouchDevice ? undefined : (e: DragEvent<HTMLImageElement>) => onDragStart(e, piece),
      onDragEnd: isTouchDevice ? undefined : onDragEnd,
      onTouchStart: (e: TouchEvent<HTMLImageElement>) => onTouchStart(e, piece),
      onTouchEnd
    };

    return (
      <img
        key={piece.id}
        src={piece.src}
        alt={`Piece ${piece.id}`}
        loading="lazy"
        draggable={!isTouchDevice}
        className="puzzle-piece"
        {...pieceEventHandlers}
      />
    );
  };

  return (
    <div className="puzzle-pieces" role="region" aria-label="퍼즐 조각 영역">
      <h2 id="pieces-title">퍼즐 조각</h2>
      <div 
        className="pieces-grid"
        role="grid"
        aria-labelledby="pieces-title"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '1rem',
          padding: '1rem'
        }}
      >
        {pieces.map(renderPuzzlePiece)}
      </div>
    </div>
  );
});

PuzzlePieces.displayName = 'PuzzlePieces';

export default PuzzlePieces;