
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChessBoard from '@/components/ChessBoard';
import GameInfo from '@/components/GameInfo';
import { Position, ChessBoard as ChessBoardType, PieceColor, deserializeChessBoard } from '@/models/ChessTypes';
import { initializeBoard, getPieceAtPosition, getValidMovesForPiece, makeMove } from '@/utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useOnlineGame } from '@/hooks/useOnlineGame';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, ChevronLeft, Users, Clock, Shield, AlertTriangle, CheckCircle, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast as sonnerToast } from '@/components/ui/use-toast';

const OnlineGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
  const [board, setBoard] = useState<ChessBoardType>(initializeBoard());
  const isMobile = useIsMobile();
  const [showJoinedNotification, setShowJoinedNotification] = useState(false);
  
  const { 
    isConnected, 
    isPlayerTurn, 
    opponentConnected,
    waitingForOpponent,
    updateGameState, 
    subscribeToGameChanges,
    joinGame
  } = useOnlineGame(gameId || '');
  
  useEffect(() => {
    if (!gameId) return;
    
    // Join or create the game when component mounts
    const setupGame = async () => {
      try {
        console.log("Setting up game...");
        const { color, initialBoard, opponentJoined } = await joinGame();
        setPlayerColor(color);
        
        if (initialBoard) {
          setBoard(initialBoard);
        }
        
        // Show notification when successfully joined
        toast({
          title: "Game joined!",
          description: `You are playing as ${color === 'white' ? 'White' : 'Black'}.`,
          variant: "default"
        });
        
        setShowJoinedNotification(true);
        setTimeout(() => setShowJoinedNotification(false), 3000);
        
        console.log(`Joined as ${color}, opponent joined: ${opponentJoined}`);
        
        if (opponentJoined) {
          toast({
            title: "Game started!",
            description: `Both players connected. ${color === 'white' ? 'You' : 'Your opponent'} move first.`,
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Error setting up game:", error);
        toast({
          title: "Error joining game",
          description: "Could not join the game. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    setupGame();
    
    // Subscribe to game changes
    const unsubscribe = subscribeToGameChanges((newBoard) => {
      console.log("Got board update from subscription");
      setBoard(newBoard);
      
      // Check for game status notifications
      if (newBoard.isCheck && !newBoard.isCheckmate) {
        toast({
          title: "Check!",
          description: `${newBoard.currentTurn === 'white' ? 'White' : 'Black'} is in check.`,
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
    });
    
    return () => {
      unsubscribe();
    };
  }, [gameId, joinGame, subscribeToGameChanges, toast]);
  
  // Effect to monitor opponent connection status
  useEffect(() => {
    if (opponentConnected && waitingForOpponent) {
      console.log("Opponent joined notification triggered");
      toast({
        title: "Opponent joined!",
        description: "Your opponent has joined the game. The match is ready to begin.",
      });
      
      // Use sonner toast for a different visual notification
      sonnerToast({
        title: "Game started!",
        description: "Your opponent has joined. Let's play!",
      });
    }
  }, [opponentConnected, waitingForOpponent, toast]);
  
  // Check if it's the current player's turn
  const isTurnToPlay = playerColor === board.currentTurn && opponentConnected;
  
  // Handle click on a square
  const handleSquareClick = (position: Position) => {
    // Only allow moves if it's the player's turn
    if (!isTurnToPlay || board.isCheckmate) {
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
        
        // Send the updated board to the other player
        updateGameState(updatedBoard);
        
        return;
      }
    }
    
    // If clicking on a new piece of the current player's color
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
  const handleReset = async () => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    await updateGameState(newBoard);
    toast({
      title: "New Game",
      description: "The board has been reset. White moves first.",
    });
  };
  
  // Copy game ID to clipboard
  const copyGameId = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      toast({
        title: "Game ID copied",
        description: "The game ID has been copied to your clipboard.",
      });
    }
  };
  
  // Display board with proper orientation based on player color
  const flippedBoard = playerColor === 'black';
  
  // Handle resignation
  const handleResign = async () => {
    toast({
      title: "Game Forfeit",
      description: `You resigned the game. ${playerColor === 'white' ? 'Black' : 'White'} wins.`,
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
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">
                ChessMaster
              </div>
            </div>
            
            <div className="flex items-center ml-auto space-x-2">
              <Button 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10" 
                onClick={() => navigate('/multiplayer')}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Lobby
              </Button>
              
              <div className="flex items-center py-1.5 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-white/60 text-sm mr-2">Game ID:</span>
                <code className="font-mono text-amber-300">{gameId}</code>
                <Button variant="ghost" size="icon" className="ml-1 h-6 w-6 hover:bg-white/10 text-white/60 hover:text-white" onClick={copyGameId}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Game Status */}
          <AnimatePresence mode="wait">
            {waitingForOpponent ? (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-lg mb-4 flex items-center"
              >
                <Clock className="mr-2 h-5 w-5 text-indigo-300 animate-pulse" />
                <div>
                  <div className="font-semibold text-indigo-200">Waiting for opponent to join</div>
                  <div className="text-sm text-indigo-300/80">Share the game ID with a friend to play together</div>
                </div>
              </motion.div>
            ) : !opponentConnected ? (
              <motion.div 
                key="disconnected"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-amber-500/20 border border-amber-500/30 p-3 rounded-lg mb-4 flex items-center"
              >
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-300" />
                <div>
                  <div className="font-semibold text-amber-200">Opponent disconnected</div>
                  <div className="text-sm text-amber-300/80">Waiting for reconnection...</div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="connected"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-lg mb-4 flex items-center"
              >
                <Users className="mr-2 h-5 w-5 text-emerald-300" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                  <div>
                    <div className="font-semibold">
                      {isTurnToPlay ? (
                        <span className="text-emerald-300">Your turn</span>
                      ) : (
                        <span className="text-amber-300">Opponent's turn</span>
                      )}
                    </div>
                    <div className="text-sm text-white/70">Playing as {playerColor === 'white' ? 'White ♙' : 'Black ♟︎'}</div>
                  </div>
                  <div className="mt-1 sm:mt-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isTurnToPlay 
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                    }`}>
                      {isTurnToPlay ? (
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
            )}
          </AnimatePresence>
          
          {/* Successfully joined notification */}
          <AnimatePresence>
            {showJoinedNotification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-lg mb-4 flex items-center"
              >
                <CheckCircle className="mr-2 h-5 w-5 text-emerald-300" />
                <div>
                  <div className="font-semibold text-emerald-200">Successfully joined!</div>
                  <div className="text-sm text-emerald-300/80">
                    You are playing as {playerColor === 'white' ? 'White' : 'Black'}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
            
            {/* Player Badge */}
            <motion.div 
              className="mt-4 p-4 rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center">
                <Shield className={`h-5 w-5 mr-2 ${playerColor === 'white' ? 'text-amber-300' : 'text-indigo-400'}`} />
                <div>
                  <div className="text-sm text-white/60">Playing as</div>
                  <div className="font-semibold">
                    {playerColor === 'white' ? (
                      <span className="text-amber-300">White Player</span>
                    ) : (
                      <span className="text-indigo-400">Black Player</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnlineGame;
