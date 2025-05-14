
import React from 'react';
import { Position } from '../models/ChessTypes';
import { cn } from '@/lib/utils';

interface ChessSquareProps {
  position: Position;
  isLightSquare: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isCheck: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  position,
  isLightSquare,
  isSelected,
  isValidMove,
  isCheck,
  onClick,
  children
}) => {
  const file = String.fromCharCode(97 + position.col); // 'a' through 'h'
  const rank = 8 - position.row; // 1 through 8
  
  const isFirstRow = position.row === 7;
  const isFirstCol = position.col === 0;
  
  return (
    <div 
      className={cn(
        'relative w-full pb-[100%] cursor-pointer transition-colors',
        isLightSquare ? 'bg-chess-lightSquare' : 'bg-chess-darkSquare',
        isSelected && 'bg-chess-selected',
        isValidMove && 'bg-chess-highlight',
        isCheck && 'bg-red-900/50'
      )}
      onClick={onClick}
    >
      {/* File notation (a-h) */}
      {isFirstRow && (
        <div className="absolute bottom-0 right-1 text-chess-notation text-xs opacity-60">
          {file}
        </div>
      )}
      
      {/* Rank notation (1-8) */}
      {isFirstCol && (
        <div className="absolute top-0 left-1 text-chess-notation text-xs opacity-60">
          {rank}
        </div>
      )}
      
      {/* Valid move indicator */}
      {isValidMove && !children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-chess-possible" />
        </div>
      )}
      
      {/* Piece */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ChessSquare;
