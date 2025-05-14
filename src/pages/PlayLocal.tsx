
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChessBoard from '@/components/ChessBoard';
import GameInfo from '@/components/GameInfo';
import { Position, ChessBoard as ChessBoardType, PieceColor } from '@/models/ChessTypes';
import { initializeBoard, getPieceAtPosition, getValidMovesForPiece, makeMove } from '@/utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronLeft, Brain } from 'lucide-react';
import { useMakeCPUMove } from '@/hooks/useMakeCPUMove';

const PlayLocal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [board, setBoard] = useState<ChessBoardType>(initializeBoard());
  
  // Get the state from navigation
  const locationState = location.state as { 
    playerColor: PieceColor; 
    difficulty: string;
  } | null;
  
  // Default to white if no color selected
  const playerColor = locationState?.playerColor || 'white';
  const difficulty = locationState?.difficulty || 'intermediate';
  
  // Create a custom hook for CPU moves
  const makeCPUMove = useMakeCPUMove(difficulty);

  // Check if it's the player's turn
  const isPlayerTurn = board.currentTurn === playerColor;
  
  // Make CPU move when it's CPU's turn
  useEffect(() => {
    // Only make CPU move if it's not player's turn and the game isn't over
    if (!isPlayerTurn && !board.isCheckmate) {
      // Small delay to make the CPU move feel more natural
      const timeoutId = setTimeout(() => {
        const newBoard = makeCPUMove(board);
        setBoard(newBoard);
        
        // Check for game state changes after CPU move
        if (newBoard.isCheck && !newBoard.isCheckmate) {
          toast({
            title: "Check!",
            description: `${newBoard.currentTurn === 'white' ? 'White' : 'Black'} is in check.`
          });
        }
        
        if (newBoard.isCheckmate) {
          const winner = newBoard.currentTurn === 'white' ? 'Black' : 'White';
          toast({
            title: "Checkmate!",
            description: `${winner} wins the game.`,
            variant: "destructive"
          });
        }
      }, 800);
      
      return () => clearTimeout(timeoutId);
    }
  }, [board, isPlayerTurn, makeCPUMove, toast]);

  // Handle click on a square
  const handleSquareClick = (position: Position) => {
    // If it's not player's turn or game is over, don't allow moves
    if (!isPlayerTurn || board.isCheckmate) {
      return;
    }
    
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
    
    // If clicking on a new piece of the player's color
    if (clickedPiece && clickedPiece.color === board.currentTurn && clickedPiece.color === playerColor) {
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

  // Display board with proper orientation based on player's color
  const flippedBoard = playerColor === 'black';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-chess-background to-neutral-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['♟︎', '♞', '♜', '♛', '♚', '♝'].map((piece, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl text-white/5"
            initial={{ 
              x: Math.random() * 100 - 50 + (index * 100),
              y: Math.random() * 100 + 50, 
              opacity: 0.05 
            }}
            animate={{ 
              x: [null, Math.random() * 200 - 100 + (index * 100)], 
              y: [null, Math.random() * 100 + 100],
              opacity: [0.05, 0.08, 0.05]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            {piece}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-sm bg-black/30 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/local-game')}
              className="hover:bg-white/5 text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Button>
            
            <div className="flex items-center ml-auto">
              <div className="bg-white/10 backdrop-blur-sm py-2 px-3 rounded-full flex items-center shadow-sm border border-white/10">
                <Brain className="h-4 w-4 text-amber-400 mr-2" />
                <span className="text-sm font-medium text-white">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} CPU
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game status bar */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <motion.div 
            animate={{ 
              opacity: isPlayerTurn ? 1 : 0.7,
              scale: isPlayerTurn ? 1 : 0.98,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center text-white"
          >
            <div className="font-medium">
              {isPlayerTurn 
                ? "Your turn" 
                : "CPU is thinking..."
              }
            </div>
            <div className="mx-2 text-white/50">•</div>
            <div>Playing as {playerColor === 'white' ? 'White' : 'Black'}</div>
          </motion.div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <motion.div 
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-2 border border-white/10 shadow-lg bg-black/40 backdrop-blur-sm">
              <ChessBoard 
                board={board} 
                onSquareClick={handleSquareClick}
                flipped={flippedBoard}
              />
            </Card>
          </motion.div>
          <motion.div 
            className="w-full lg:w-1/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <GameInfo 
                board={board} 
                onReset={handleReset} 
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlayLocal;
