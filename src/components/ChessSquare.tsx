
import React from 'react';
import ChessPiece from './ChessPiece';
import { Position, Piece } from '../models/ChessTypes';

export interface ChessSquareProps {
  position: Position;
  piece?: Piece | undefined;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isValidMove,
  onClick,
}) => {
  // Use classic chess board colors - true black and white
  let bgColor = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
  
  // Apply highlighting styles
  if (isSelected) {
    bgColor = 'bg-blue-300';
  }

  // Combine all of our styles
  const squareClass = `w-1/8 aspect-square flex items-center justify-center relative ${bgColor} transition-colors hover:brightness-110 cursor-pointer`;

  return (
    <div className={squareClass} onClick={onClick}>
      {piece && <ChessPiece piece={piece} />}
      
      {/* Show valid move indicator */}
      {isValidMove && (
        <div className="absolute w-1/4 h-1/4 rounded-full bg-green-500/50"></div>
      )}
      
      {/* Show row/column notations */}
      {position.col === 0 && (
        <span className={`absolute bottom-0 left-1 text-xs ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'}`}>
          {8 - position.row}
        </span>
      )}
      
      {position.row === 7 && (
        <span className={`absolute bottom-0 right-1 text-xs ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'}`}>
          {String.fromCharCode(97 + position.col)}
        </span>
      )}
    </div>
  );
};

export default ChessSquare;
