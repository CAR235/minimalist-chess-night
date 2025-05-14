
import React from 'react';
import ChessPiece from './ChessPiece';
import { Position, Piece } from '../models/ChessTypes';
import { motion } from 'framer-motion';

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
  // Use a more modern and elegant color scheme
  let bgColor = isLight ? 'bg-slate-200' : 'bg-slate-600';
  let hoverColor = isLight ? 'hover:bg-slate-300' : 'hover:bg-slate-700';
  
  // Apply highlighting styles with more refined colors
  if (isSelected) {
    bgColor = isLight ? 'bg-emerald-200' : 'bg-emerald-700';
    hoverColor = isLight ? 'hover:bg-emerald-300' : 'hover:bg-emerald-800';
  }

  // Combine all of our styles
  const squareClass = `w-full h-full flex items-center justify-center relative ${bgColor} ${hoverColor} transition-all duration-200 cursor-pointer`;

  return (
    <div className={squareClass} onClick={onClick} style={{ width: '12.5%', paddingBottom: '12.5%' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        {piece && <ChessPiece piece={piece} />}
        
        {/* Show valid move indicator with a more subtle style */}
        {isValidMove && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5
            }}
            className={`absolute w-1/3 h-1/3 rounded-full ${
              piece ? 'ring-2 ring-offset-2 ring-emerald-500/70 ring-offset-transparent' : 'bg-emerald-500/40'
            }`}
          />
        )}
        
        {/* Show row/column notations with refined styling */}
        {position.col === 0 && (
          <span className={`absolute bottom-0.5 left-1.5 text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
            {8 - position.row}
          </span>
        )}
        
        {position.row === 7 && (
          <span className={`absolute bottom-0.5 right-1.5 text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
            {String.fromCharCode(97 + position.col)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChessSquare;
