
import React, { useState } from 'react';
import ChessBoard from './ChessBoard';
import GameInfo from './GameInfo';
import { Position, ChessBoard as ChessBoardType } from '../models/ChessTypes';
import { initializeBoard, getPieceAtPosition, getValidMovesForPiece, makeMove } from '../utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<ChessBoardType>(initializeBoard());
  const { toast } = useToast();

  // Handle click on a square
  const handleSquareClick = (position: Position) => {
    const clickedPiece = getPieceAtPosition(board, position);
    
    // If the game is over, don't allow moves
    if (board.isCheckmate) {
      return;
    }
    
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
        
        // Check notification after the move
        if (updatedBoard.isCheck && !updatedBoard.isCheckmate) {
          toast({
            title: "Check!",
            description: `${updatedBoard.currentTurn === 'white' ? 'White' : 'Black'} is in check.`,
          });
        }
        
        if (updatedBoard.isCheckmate) {
          // The winner is the opposite of currentTurn since the turn has already changed
          const winner = updatedBoard.currentTurn === 'white' ? 'Black' : 'White';
          toast({
            title: "Checkmate!",
            description: `${winner} wins the game.`,
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
    <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-6xl mx-auto p-4">
      <motion.div 
        className="w-full lg:w-2/3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-2 bg-neutral-900 border-neutral-700">
          <ChessBoard 
            board={board} 
            onSquareClick={handleSquareClick} 
          />
        </Card>
      </motion.div>
      <motion.div 
        className="w-full lg:w-1/3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GameInfo 
          board={board} 
          onReset={handleReset} 
        />
      </motion.div>
    </div>
  );
};

export default ChessGame;
