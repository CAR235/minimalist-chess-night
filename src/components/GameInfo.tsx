
import React from 'react';
import { ChessBoard, Piece, PieceColor } from '../models/ChessTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, RotateCcw, Flag } from 'lucide-react';
import MoveHistory from './MoveHistory';

interface GameInfoProps {
  board: ChessBoard;
  onReset: () => void;
  onResign?: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ board, onReset, onResign }) => {
  const renderCapturedPieces = (color: PieceColor) => {
    const pieces = board.capturedPieces.filter(piece => piece.color === color);
    
    if (pieces.length === 0) return null;
    
    // Group by piece type and sort by value
    const pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
    pieces.sort((a, b) => pieceValues[b.type] - pieceValues[a.type]);
    
    return (
      <div className="flex flex-wrap gap-1">
        {pieces.map((piece, index) => (
          <span key={index} className="text-lg opacity-70">
            {getPieceSymbol(piece)}
          </span>
        ))}
      </div>
    );
  };
  
  const getPieceSymbol = (piece: Piece): string => {
    // Simple mapping for piece symbols
    const symbols = {
      pawn: piece.color === 'white' ? '♙' : '♟',
      rook: piece.color === 'white' ? '♖' : '♜',
      knight: piece.color === 'white' ? '♘' : '♞',
      bishop: piece.color === 'white' ? '♗' : '♝',
      queen: piece.color === 'white' ? '♕' : '♛',
      king: piece.color === 'white' ? '♔' : '♚'
    };
    
    return symbols[piece.type];
  };
  
  let statusMessage = `${board.currentTurn === 'white' ? 'White' : 'Black'}'s turn`;
  
  if (board.isCheck) {
    statusMessage = `${board.currentTurn === 'white' ? 'White' : 'Black'} is in check!`;
  }
  
  if (board.isCheckmate) {
    statusMessage = `Checkmate! ${board.currentTurn === 'black' ? 'White' : 'Black'} wins!`;
  }
  
  return (
    <div className="w-full max-w-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-neutral-800 text-white border-neutral-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Game Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 font-bold text-center py-2 text-amber-400">
              {statusMessage}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-xs mb-1 text-neutral-400 uppercase font-semibold">White captured</h3>
                {renderCapturedPieces('black')}
              </div>
              <div>
                <h3 className="text-xs mb-1 text-neutral-400 uppercase font-semibold">Black captured</h3>
                {renderCapturedPieces('white')}
              </div>
            </div>
            
            <div className="flex gap-2 justify-center mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReset} 
                className="bg-neutral-700 hover:bg-neutral-600 text-white border-neutral-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" /> 
                New Game
              </Button>
              
              {onResign && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onResign} 
                  className="bg-neutral-700 hover:bg-neutral-600 text-white border-neutral-600"
                >
                  <Flag className="h-4 w-4 mr-2" /> 
                  Resign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-800 text-white border-neutral-700 h-64 md:h-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Moves</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-60px)]">
            <MoveHistory 
              moves={board.moveHistory} 
              currentMove={board.moveHistory.length - 1} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameInfo;
