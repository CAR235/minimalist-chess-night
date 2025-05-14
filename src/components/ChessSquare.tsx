
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
  // Use a more modern and sleek color scheme that matches the project's amber and dark theme
  let bgColor = isLight ? 'bg-[#3D3A41]' : 'bg-[#262428]';
  
  // Apply highlighting styles with amber tones to match the project
  if (isSelected) {
    bgColor = 'bg-amber-500/40';
  }

  // Combine all of our styles
  const squareClass = `w-full h-full flex items-center justify-center relative ${bgColor} transition-colors hover:brightness-110 cursor-pointer`;

  return (
    <div className={squareClass} onClick={onClick} style={{ width: '12.5%', paddingBottom: '12.5%' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        {piece && <ChessPiece piece={piece} />}
        
        {/* Show valid move indicator with amber color */}
        {isValidMove && (
          <div className="absolute w-1/4 h-1/4 rounded-full bg-amber-400/50 valid-move-indicator"></div>
        )}
        
        {/* Show row/column notations with amber tint */}
        {position.col === 0 && (
          <span className={`absolute bottom-0 left-1 text-xs ${isLight ? 'text-amber-300/40' : 'text-amber-300/30'}`}>
            {8 - position.row}
          </span>
        )}
        
        {position.row === 7 && (
          <span className={`absolute bottom-0 right-1 text-xs ${isLight ? 'text-amber-300/40' : 'text-amber-300/30'}`}>
            {String.fromCharCode(97 + position.col)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChessSquare;
