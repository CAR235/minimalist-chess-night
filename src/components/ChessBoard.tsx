
import React from 'react';
import ChessSquare from './ChessSquare';
import { ChessBoard as ChessBoardType, Position } from '../models/ChessTypes';

interface Props {
  board: ChessBoardType;
  onSquareClick: (position: Position) => void;
  flipped?: boolean; // Add flipped prop for multiplayer mode
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
    
    return (
      <ChessSquare
        key={`${displayRow}-${displayCol}`}
        position={position}
        piece={piece}
        isLight={(displayRow + displayCol) % 2 === 1}
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
        <div key={row} className="flex">
          {squareRow}
        </div>
      );
    }
    
    // If board is flipped, reverse the rows
    return flipped ? rows.reverse() : rows;
  };

  return (
    <div className="w-full max-w-md md:max-w-lg lg:max-w-xl aspect-square border border-gray-700 rounded overflow-hidden shadow-lg">
      {renderBoard()}
    </div>
  );
};

export default ChessBoard;
