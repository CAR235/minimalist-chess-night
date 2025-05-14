
import React, { useState, useEffect } from 'react';
import ChessBoard from './ChessBoard';
import GameInfo from './GameInfo';
import { Position, ChessBoard as ChessBoardType } from '../models/ChessTypes';
import { initializeBoard, getPieceAtPosition, getValidMovesForPiece, makeMove } from '../utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<ChessBoardType>(initializeBoard());
  const { toast } = useToast();

  // Handle click on a square
  const handleSquareClick = (position: Position) => {
    const clickedPiece = getPieceAtPosition(board, position);
    
    // If a piece is already selected
    if (board.selectedPiece) {
      // If clicking on the same piece, deselect it
      if (
        board.selectedPiece.position.row === position.row && 
        board.selectedPiece.position.col === position.col
      ) {
        setBoard({
          ...board,
          selectedPiece: null,
          validMoves: []
        });
        return;
      }
      
      // If clicking on a valid move position, make the move
      const isValidMove = board.validMoves.some(
        move => move.row === position.row && move.col === position.col
      );
      
      if (isValidMove) {
        const updatedBoard = makeMove(
          board, 
          board.selectedPiece.position, 
          position
        );
        
        setBoard(updatedBoard);
        
        if (updatedBoard.isCheck && !updatedBoard.isCheckmate) {
          toast({
            title: "Check!",
            description: `${updatedBoard.currentTurn === 'white' ? 'White' : 'Black'} is in check.`,
          });
        }
        
        if (updatedBoard.isCheckmate) {
          toast({
            title: "Checkmate!",
            description: `${updatedBoard.currentTurn === 'black' ? 'White' : 'Black'} wins the game.`,
            variant: "destructive"
          });
        }
        
        return;
      }
    }
    
    // If clicking on a new piece of the current player's color
    if (clickedPiece && clickedPiece.color === board.currentTurn) {
      const validMoves = getValidMovesForPiece(board, clickedPiece);
      
      setBoard({
        ...board,
        selectedPiece: clickedPiece,
        validMoves
      });
      return;
    }
    
    // If clicking on an empty square or opponent's piece with no selection
    setBoard({
      ...board,
      selectedPiece: null,
      validMoves: []
    });
  };

  // Reset the game
  const handleReset = () => {
    setBoard(initializeBoard());
    toast({
      title: "New Game",
      description: "The board has been reset. White moves first.",
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto p-4">
      <ChessBoard 
        board={board} 
        onSquareClick={handleSquareClick} 
      />
      <GameInfo 
        board={board} 
        onReset={handleReset} 
      />
    </div>
  );
};

export default ChessGame;
