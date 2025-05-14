
import React from 'react';
import { ChessBoard, Piece, PieceColor } from '../models/ChessTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Flag } from 'lucide-react';
import MoveHistory from './MoveHistory';
import { Separator } from '@/components/ui/separator';

interface GameInfoProps {
  board: ChessBoard;
  onReset: () => void;
  onResign?: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ board, onReset, onResign }) => {
  const renderCapturedPieces = (color: PieceColor) => {
    const pieces = board.capturedPieces.filter(piece => piece.color === color);
    
    if (pieces.length === 0) return <div className="text-xs text-muted-foreground">None</div>;
    
    // Group by piece type and sort by value
    const pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
    pieces.sort((a, b) => pieceValues[b.type] - pieceValues[a.type]);
    
    return (
      <div className="flex flex-wrap gap-1">
        {pieces.map((piece, index) => (
          <span key={index} className="text-base opacity-90">
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
    <div className="w-full space-y-4">
      <Card className="border shadow-md">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-lg">Game Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-4 font-bold text-center py-2 bg-secondary/40 rounded-md text-amber-500">
            {statusMessage}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-xs mb-2 text-muted-foreground uppercase font-semibold tracking-wider">White captured</h3>
              {renderCapturedPieces('black')}
            </div>
            <div>
              <h3 className="text-xs mb-2 text-muted-foreground uppercase font-semibold tracking-wider">Black captured</h3>
              {renderCapturedPieces('white')}
            </div>
          </div>
          
          <div className="flex gap-2 justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset} 
            >
              <RotateCcw className="h-4 w-4 mr-2" /> 
              New Game
            </Button>
            
            {onResign && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onResign}
                variant="destructive"
              >
                <Flag className="h-4 w-4 mr-2" /> 
                Resign
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-md h-80">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-lg">Move History</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)] p-0">
          <MoveHistory 
            moves={board.moveHistory} 
            currentMove={board.moveHistory.length - 1} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInfo;
