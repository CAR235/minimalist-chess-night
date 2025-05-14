
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Move } from '@/models/ChessTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <div className="text-center text-sm text-muted-foreground p-4">
      No moves yet
    </div>
  );

  // Group moves in pairs for display (white and black)
  const moveRows: [Move, Move | null][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    moveRows.push([moves[i], moves[i + 1] || null]);
  }

  return (
    <ScrollArea className="h-full max-h-[300px]">
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
                  className={`py-1.5 px-2 ${currentMove === idx * 2 ? 'bg-primary/10' : ''} 
                  hover:bg-secondary/30 cursor-pointer rounded-sm`}
                  onClick={() => onMoveClick?.(idx * 2)}
                >
                  {formatMove(row[0])}
                </TableCell>
                {row[1] ? (
                  <TableCell 
                    className={`py-1.5 px-2 ${currentMove === idx * 2 + 1 ? 'bg-primary/10' : ''} 
                    hover:bg-secondary/30 cursor-pointer rounded-sm`}
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
