
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Move } from '@/models/ChessTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoveHistoryProps {
  moves: Move[];
  currentMove: number;
  onMoveClick?: (index: number) => void;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ 
  moves, 
  currentMove,
  onMoveClick
}) => {
  if (!moves.length) return (
    <div className="text-center text-sm text-muted-foreground p-4 italic">
      No moves yet. Game will begin when both players have joined.
    </div>
  );

  // Group moves in pairs for display (white and black)
  const moveRows: [Move, Move | null][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    moveRows.push([moves[i], moves[i + 1] || null]);
  }

  // Navigation handlers
  const handlePrevMove = () => {
    if (currentMove > 0 && onMoveClick) {
      onMoveClick(currentMove - 1);
    }
  };

  const handleNextMove = () => {
    if (currentMove < moves.length - 1 && onMoveClick) {
      onMoveClick(currentMove + 1);
    }
  };

  const handleLatestMove = () => {
    if (onMoveClick && moves.length > 0) {
      onMoveClick(moves.length - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 max-h-[220px]">
        <div className="p-2">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-8 text-center py-2 text-muted-foreground">No.</TableHead>
                <TableHead className="py-2 text-muted-foreground">White</TableHead>
                <TableHead className="py-2 text-muted-foreground">Black</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moveRows.map((row, idx) => (
                <TableRow 
                  key={idx} 
                  className="border-b border-border/30 hover:bg-secondary/20"
                >
                  <TableCell className="py-1.5 text-xs text-center text-muted-foreground">
                    {idx + 1}.
                  </TableCell>
                  <TableCell 
                    className={`py-1.5 px-2 ${currentMove === idx * 2 ? 'bg-primary/20 text-primary font-medium' : ''} 
                    hover:bg-secondary/30 cursor-pointer rounded-sm transition-colors`}
                    onClick={() => onMoveClick?.(idx * 2)}
                  >
                    {formatMove(row[0])}
                  </TableCell>
                  {row[1] ? (
                    <TableCell 
                      className={`py-1.5 px-2 ${currentMove === idx * 2 + 1 ? 'bg-primary/20 text-primary font-medium' : ''} 
                      hover:bg-secondary/30 cursor-pointer rounded-sm transition-colors`}
                      onClick={() => onMoveClick?.(idx * 2 + 1)}
                    >
                      {formatMove(row[1])}
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      
      {onMoveClick && moves.length > 1 && (
        <div className="flex items-center justify-between px-2 py-2 border-t border-border/30 mt-auto">
          <Button 
            variant="outline"
            size="sm"
            onClick={handlePrevMove}
            disabled={currentMove === 0}
            className="h-8 px-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-xs text-muted-foreground">
            {currentMove + 1} / {moves.length}
          </span>
          
          <div className="flex gap-1">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleNextMove}
              disabled={currentMove === moves.length - 1}
              className="h-8 px-2"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLatestMove}
              disabled={currentMove === moves.length - 1}
              className="h-8 px-2"
            >
              Latest
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to format a move in algebraic notation
const formatMove = (move: Move): string => {
  if (!move) return "";
  
  const pieceSymbol = getPieceSymbol(move.piece.type);
  const from = `${String.fromCharCode(97 + move.from.col)}${8 - move.from.row}`;
  const to = `${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`;
  
  if (move.isCastling) {
    // Kingside or queenside castling
    return move.to.col > move.from.col ? "O-O" : "O-O-O";
  }
  
  // Capture notation
  const capture = move.capturedPiece ? "x" : "";
  
  return `${pieceSymbol}${from}${capture}${to}`;
};

// Helper to get piece symbol
const getPieceSymbol = (type: string): string => {
  switch(type) {
    case 'king': return 'K';
    case 'queen': return 'Q';
    case 'rook': return 'R';
    case 'bishop': return 'B';
    case 'knight': return 'N';
    case 'pawn': return '';
    default: return '';
  }
};

export default MoveHistory;
