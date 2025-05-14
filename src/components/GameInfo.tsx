
import React, { useState } from 'react';
import { ChessBoard, Piece, PieceColor, Move } from '../models/ChessTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Flag, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import MoveHistory from './MoveHistory';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface GameInfoProps {
  board: ChessBoard;
  onReset: () => void;
  onResign?: () => void;
  showMoveControls?: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ 
  board, 
  onReset, 
  onResign, 
  showMoveControls = false 
}) => {
  const [viewingMoveIndex, setViewingMoveIndex] = useState<number>(board.moveHistory.length - 1);
  
  const renderCapturedPieces = (color: PieceColor) => {
    const pieces = board.capturedPieces.filter(piece => piece.color === color);
    
    if (pieces.length === 0) return <div className="text-xs text-muted-foreground italic">None captured</div>;
    
    // Group by piece type and sort by value
    const pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
    pieces.sort((a, b) => pieceValues[b.type] - pieceValues[a.type]);
    
    return (
      <div className="flex flex-wrap gap-1">
        {pieces.map((piece, index) => (
          <span 
            key={index} 
            className={`text-base ${piece.color === 'white' ? 'text-amber-300' : 'text-indigo-300'}`}
            title={`${piece.color === 'white' ? 'White' : 'Black'} ${piece.type}`}
          >
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
  let statusIcon = <Clock className="h-5 w-5" />;
  let statusClass = "bg-blue-500/20 border-blue-500/40 text-blue-300";
  
  if (board.isCheck) {
    statusMessage = `${board.currentTurn === 'white' ? 'White' : 'Black'} is in check!`;
    statusIcon = <AlertTriangle className="h-5 w-5" />;
    statusClass = "bg-amber-500/20 border-amber-500/40 text-amber-300";
  }
  
  if (board.isCheckmate) {
    const winner = board.currentTurn === 'black' ? 'White' : 'Black';
    statusMessage = `Checkmate! ${winner} wins!`;
    statusIcon = <CheckCircle className="h-5 w-5" />;
    statusClass = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
  }
  
  const handleMoveClick = (index: number) => {
    setViewingMoveIndex(index);
    // Additional logic could be added here to show board state at this move
  };
  
  return (
    <div className="w-full space-y-4">
      <Card className="border shadow-md bg-slate-800/50 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-2 border-b border-white/10">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Game Status</span>
            <Badge 
              variant="outline" 
              className={`${statusClass} flex items-center gap-1.5 px-2 py-1 text-xs font-normal`}
            >
              {statusIcon}
              {statusMessage}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-slate-700/30 border border-white/10">
              <h3 className="text-xs mb-2 text-white/70 uppercase font-semibold tracking-wider flex items-center">
                <div className="w-2 h-2 rounded-full bg-amber-400 mr-1.5"></div>
                White captured
              </h3>
              {renderCapturedPieces('black')}
            </div>
            <div className="p-3 rounded-lg bg-slate-700/30 border border-white/10">
              <h3 className="text-xs mb-2 text-white/70 uppercase font-semibold tracking-wider flex items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1.5"></div>
                Black captured
              </h3>
              {renderCapturedPieces('white')}
            </div>
          </div>
          
          <div className="flex gap-2 justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              className="border-white/20 hover:bg-white/10" 
            >
              <RotateCcw className="h-4 w-4 mr-2" /> 
              New Game
            </Button>
            
            {onResign && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={onResign}
              >
                <Flag className="h-4 w-4 mr-2" /> 
                Resign
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-md h-80 bg-slate-800/50 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-2 border-b border-white/10">
          <CardTitle className="text-lg">Move History</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)] p-0">
          <MoveHistory 
            moves={board.moveHistory} 
            currentMove={viewingMoveIndex} 
            onMoveClick={showMoveControls ? handleMoveClick : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInfo;
