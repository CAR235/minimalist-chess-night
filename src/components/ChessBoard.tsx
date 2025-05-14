
import React from 'react';
import ChessSquare from './ChessSquare';
import { ChessBoard as ChessBoardType, Position } from '../models/ChessTypes';
import { motion } from 'framer-motion';

interface Props {
  board: ChessBoardType;
  onSquareClick: (position: Position) => void;
  flipped?: boolean;
}

const ChessBoard: React.FC<Props> = ({ board, onSquareClick, flipped = false }) => {
  const renderSquare = (row: number, col: number) => {
    // If board is flipped, invert the coordinates
    const displayRow = flipped ? 7 - row : row;
    const displayCol = flipped ? 7 - col : col;
    
    const position = { row, col };
    const piece = board.pieces.find(
      p => p.position.row === row && p.position.col === col
    );
    
    const isSelected = board.selectedPiece && 
      board.selectedPiece.position.row === row && 
      board.selectedPiece.position.col === col;
      
    const isValidMove = board.validMoves.some(
      move => move.row === row && move.col === col
    );
    
    // Classic chess board has light square when sum is even (standard convention)
    return (
      <ChessSquare
        key={`${row}-${col}`}
        position={position}
        piece={piece}
        isLight={(row + col) % 2 === 0}
        isSelected={isSelected}
        isValidMove={isValidMove}
        onClick={() => onSquareClick(position)}
      />
    );
  };

  // Create board grid - if flipped, we need to render the rows in reverse order
  const renderBoard = () => {
    const rows = [];
    
    for (let row = 0; row < 8; row++) {
      const squareRow = [];
      for (let col = 0; col < 8; col++) {
        squareRow.push(renderSquare(row, col));
      }
      rows.push(
        <div key={row} className="flex w-full h-1/8" style={{ height: '12.5%' }}>
          {squareRow}
        </div>
      );
    }
    
    // If board is flipped, reverse the rows
    return flipped ? rows.reverse() : rows;
  };

  return (
    <motion.div 
      className="w-full aspect-square overflow-hidden rounded-md border-2 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderBoard()}
    </motion.div>
  );
};

export default ChessBoard;
