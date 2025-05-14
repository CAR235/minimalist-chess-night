import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChessBoard as ChessBoardType, Position, PieceColor } from '@/models/ChessTypes';
import { initializeBoard, getPieceAtPosition, getValidMovesForPiece, makeMove } from '@/utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';
import ChessBoard from '@/components/ChessBoard';
import GameInfo from '@/components/GameInfo';
import { useMakeCPUMove } from '@/hooks/useMakeCPUMove';
import { motion } from 'framer-motion';
import { ChevronLeft, Home, Users, CheckCircle, Clock } from 'lucide-react';

const PlayLocal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [board, setBoard] = useState<ChessBoardType>(initializeBoard());
  
  // Get settings from location state or use defaults
  const locationState = location.state as { 
    playerColor?: PieceColor; 
    difficulty?: string;
  } | undefined;
  
  const playerColor = locationState?.playerColor || 'white';
  const difficulty = locationState?.difficulty || 'intermediate';
  const isCPUGame = !!locationState;
  
  // Make CPU move
  const makeCPUMove = useMakeCPUMove(difficulty);
  
  // Make CPU move if it's the CPU's turn
  useEffect(() => {
    if (isCPUGame && board.currentTurn !== playerColor && !board.isCheckmate) {
      const cpuMoveTimeout = setTimeout(() => {
        const updatedBoard = makeCPUMove(board);
        setBoard(updatedBoard);
        
        if (updatedBoard.isCheck) {
          toast({
            title: "Check!",
            description: `${playerColor === 'white' ? 'You are' : 'CPU is'} in check.`,
          });
        }
        
        if (updatedBoard.isCheckmate) {
          toast({
            title: "Checkmate!",
            description: `${board.currentTurn === 'white' ? 'Black' : 'White'} wins!`,
            variant: "destructive"
          });
        }
      }, 500);
      
      return () => clearTimeout(cpuMoveTimeout);
    }
  }, [board, playerColor, isCPUGame, difficulty, makeCPUMove, toast]);

  // Handle square click
  const handleSquareClick = (position: Position) => {
    // If game is over, don't allow moves
    if (board.isCheckmate) {
      return;
    }
    
    // In CPU game, only allow player to move their pieces
    if (isCPUGame && board.currentTurn !== playerColor) {
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
          toast({
            title: "Checkmate!",
            description: `${board.currentTurn === 'white' ? 'Black' : 'White'} wins!`,
            variant: "destructive"
          });
        }
        
        return;
      }
    }
    
    // If clicking on a new piece of the current player's color
    if (clickedPiece && clickedPiece.color === board.currentTurn) {
      // In CPU mode, only allow selecting player's color
      if (isCPUGame && clickedPiece.color !== playerColor) {
        return;
      }
      
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
  
  // Get current player status
  const isPlayerTurn = !isCPUGame || board.currentTurn === playerColor;
  const flippedBoard = playerColor === 'black';
  
  // Handle resignation
  const handleResign = () => {
    toast({
      title: "Game Forfeit",
      description: `${board.currentTurn === 'white' ? 'White' : 'Black'} resigned. Game over.`,
      variant: "destructive"
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-6 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10" 
                onClick={() => navigate('/')}
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="text-xl font-bold">
                <span className="text-white">Chess</span>
                <span className="text-amber-400">Master</span>
              </div>
            </div>
            
            <div className="flex items-center ml-auto space-x-2">
              <Button 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10" 
                onClick={() => navigate('/local-game')}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Settings
              </Button>
            </div>
          </div>
          
          {/* Game Status */}
          <motion.div 
            className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-lg mb-4 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Users className="mr-2 h-5 w-5 text-emerald-300" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
              <div>
                <div className="font-semibold">
                  {isPlayerTurn ? (
                    <span className="text-emerald-300">Your turn</span>
                  ) : (
                    <span className="text-amber-300">CPU's turn</span>
                  )}
                </div>
                <div className="text-sm text-white/70">
                  {isCPUGame 
                    ? `Playing as ${playerColor === 'white' ? 'White ♙' : 'Black ♟︎'} - Level: ${difficulty}` 
                    : `Current turn: ${board.currentTurn === 'white' ? 'White ♙' : 'Black ♟︎'}`}
                </div>
              </div>
              <div className="mt-1 sm:mt-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isPlayerTurn 
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                }`}>
                  {isPlayerTurn ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" /> 
                      Active
                    </>
                  ) : (
                    <>
                      <Clock className="mr-1 h-3 w-3" /> 
                      Waiting
                    </>
                  )}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Game Area */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Chess Board */}
          <motion.div 
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-3 bg-slate-800/50 backdrop-blur-sm border border-white/10 shadow-xl">
              <CardContent className="p-0">
                <ChessBoard 
                  board={board} 
                  onSquareClick={handleSquareClick}
                  flipped={flippedBoard}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Game Info */}
          <motion.div 
            className="w-full lg:w-1/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GameInfo 
              board={board} 
              onReset={handleReset}
              onResign={handleResign}
              showMoveControls={true}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlayLocal;
