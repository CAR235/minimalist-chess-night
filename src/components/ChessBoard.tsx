
import React from 'react';
import ChessSquare from './ChessSquare';
import ChessPiece from './ChessPiece';
import { ChessBoard as ChessBoardType, Piece, Position } from '../models/ChessTypes';
import { BOARD_SIZE, getPieceAtPosition, getValidMovesForPiece } from '../utils/chessUtils';

interface ChessBoardProps {
  board: ChessBoardType;
  onSquareClick: (position: Position) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ board, onSquareClick }) => {
  // Generate the squares of the chess board
  const renderSquares = () => {
    const squares = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const position = { row, col };
        const piece = getPieceAtPosition(board, position);
        const isLightSquare = (row + col) % 2 !== 0;
        const isSelected = board.selectedPiece && 
                          board.selectedPiece.position.row === row && 
                          board.selectedPiece.position.col === col;
        
        const isValidMove = board.validMoves.some(move => 
          move.row === row && move.col === col
        );
        
        const isKingInCheck = piece?.type === 'king' && 
                              board.isCheck && 
                              piece.color === board.currentTurn;

        squares.push(
          <ChessSquare
            key={`${row}-${col}`}
            position={position}
            isLightSquare={isLightSquare}
            isSelected={isSelected}
            isValidMove={isValidMove}
            isCheck={isKingInCheck}
            onClick={() => onSquareClick(position)}
          >
            {piece && <ChessPiece piece={piece} />}
          </ChessSquare>
        );
      }
    }

    return squares;
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-square">
      <div className="grid grid-cols-8 grid-rows-8 border border-gray-700 shadow-lg">
        {renderSquares()}
      </div>
    </div>
  );
};

export default ChessBoard;
