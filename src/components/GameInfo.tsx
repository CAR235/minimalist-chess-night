
import React from 'react';
import { ChessBoard, Piece, PieceColor } from '../models/ChessTypes';
import { Button } from '@/components/ui/button';
import { toAlgebraicNotation } from '@/utils/chessUtils';

interface GameInfoProps {
  board: ChessBoard;
  onReset: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ board, onReset }) => {
  const renderCapturedPieces = (color: PieceColor) => {
    const pieces = board.capturedPieces.filter(piece => piece.color === color);
    
    if (pieces.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1">
        {pieces.map((piece, index) => (
          <span key={index} className="text-lg">
            {piece.symbol}
          </span>
        ))}
      </div>
    );
  };
  
  let statusMessage = `${board.currentTurn === 'white' ? 'White' : 'Black'}'s turn`;
  
  if (board.isCheck) {
    statusMessage = `${board.currentTurn === 'white' ? 'White' : 'Black'} is in check!`;
  }
  
  if (board.isCheckmate) {
    statusMessage = `Checkmate! ${board.currentTurn === 'black' ? 'White' : 'Black'} wins!`;
  }
  
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-chess-background text-white rounded">
      <div className="mb-3 text-center text-xl font-bold">{statusMessage}</div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm mb-1 text-chess-notation">White captured:</h3>
          {renderCapturedPieces('white')}
        </div>
        <div>
          <h3 className="text-sm mb-1 text-chess-notation">Black captured:</h3>
          {renderCapturedPieces('black')}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="bg-chess-highlight hover:bg-chess-highlight/80">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default GameInfo;
