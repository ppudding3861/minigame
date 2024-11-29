import React, { DragEvent, TouchEvent } from 'react';
import { PuzzlePiece } from '../types/puzzle';

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
   const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

   return (
       <div className="puzzle-board" role="grid" aria-label="퍼즐판">
           <h2>퍼즐판</h2>
           <div className="board-grid">
               {board.map((piece, index) => (
                   <div
                       key={index}
                       className="board-cell"
                       data-index={index}
                       role="gridcell"
                       onDragOver={!isTouchDevice ? onDragOver : undefined}
                       onDragLeave={!isTouchDevice ? onDragLeave : undefined}
                       onDrop={!isTouchDevice ? (e) => onDrop(e, index) : undefined}
                       onTouchEnd={(e) => {
                           e.preventDefault();
                           onTouchDrop(index);
                       }}
                   >
                       {piece && (
                           <div
                               className="placed-piece"
                               draggable={!isTouchDevice}
                               onClick={() => onPieceClick(piece, index)}
                               onDragStart={(e) => onDragStartFromBoard(e, piece, index)}
                               onTouchStart={(e) => onTouchStartFromBoard(e, piece, index)}
                           >
                               <img
                                   src={piece.src}
                                   alt={`Placed piece ${piece.id}`}
                                   className="placed-piece-image"
                                   draggable={false}
                               />
                           </div>
                       )}
                   </div>
               ))}
           </div>
       </div>
   );
};

export default React.memo(PuzzleBoard);
