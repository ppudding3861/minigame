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
   onPieceClick: (piece: PuzzlePiece, index: number) => void; // 클릭 핸들러 추가
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
   board,
   onDragOver,
   onDragLeave,
   onDrop,
   onTouchDrop,
   onDragStartFromBoard,
   onTouchStartFromBoard,
   onPieceClick, // 클릭 핸들러 추가
}) => {
   const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

   return (
       <div className="puzzle-board">
           <h2>퍼즐판</h2>
           <div className="board-grid">
               {board.map((piece, index) => (
                   <div
                       key={index}
                       className="board-cell"
                       data-index={index}
                       onDragOver={isTouchDevice ? undefined : onDragOver}
                       onDragLeave={isTouchDevice ? undefined : onDragLeave}
                       onDrop={isTouchDevice ? undefined : (e) => onDrop(e, index)}
                       onTouchEnd={(e) => {
                           e.preventDefault();
                           onTouchDrop(index);
                       }}
                   >
                       {piece && (
                           <div
                               className="placed-piece"
                               draggable={!isTouchDevice}
                               onClick={() => !isTouchDevice && onPieceClick(piece, index)} // 클릭 핸들러 추가
                               onDragStart={(e) => onDragStartFromBoard(e, piece, index)}
                               onTouchStart={(e) => onTouchStartFromBoard(e, piece, index)}
                           >
                               <img
                                   src={piece.src}
                                   alt={`Placed piece ${piece.id}`}
                                   className="placed-piece-image"
                                   draggable={false} // 이미지 자체의 드래그는 방지
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