
import React from 'react';
import { Piece } from '../models/ChessTypes';

interface ChessPieceProps {
  piece: Piece;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  return (
    <div 
      className={`chess-piece ${piece.color === 'white' ? 'text-white' : 'text-gray-300'}`}
    >
      {piece.symbol}
    </div>
  );
};

export default ChessPiece;
