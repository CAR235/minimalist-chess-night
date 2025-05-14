
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
  // Base styles based on the square's color
  let bgColor = isLight ? 'bg-chess-lightSquare' : 'bg-chess-darkSquare';
  
  // Apply highlighting styles
  if (isSelected) {
    bgColor = 'bg-chess-selected';
  } else if (isValidMove) {
    bgColor = isLight ? 'bg-chess-lightSquare' : 'bg-chess-darkSquare';
  }

  // Combine all of our styles
  const squareClass = `w-1/8 aspect-square flex items-center justify-center relative ${bgColor} transition-colors hover:brightness-110 cursor-pointer`;

  return (
    <div className={squareClass} onClick={onClick}>
      {piece && <ChessPiece piece={piece} />}
      
      {/* Show valid move indicator */}
      {isValidMove && (
        <div className="absolute w-1/3 h-1/3 rounded-full bg-chess-possible opacity-75 valid-move-indicator"></div>
      )}
      
      {/* Show row/column notations */}
      {position.col === 0 && (
        <span className="absolute bottom-0 left-1 text-xs text-chess-notation">
          {8 - position.row}
        </span>
      )}
      
      {position.row === 7 && (
        <span className="absolute bottom-0 right-1 text-xs text-chess-notation">
          {String.fromCharCode(97 + position.col)}
        </span>
      )}
    </div>
  );
};

export default ChessSquare;
