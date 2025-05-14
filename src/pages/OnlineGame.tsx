
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChessBoard from '@/components/ChessBoard';
import GameInfo from '@/components/GameInfo';
import { Position, ChessBoard as ChessBoardType, PieceColor } from '@/models/ChessTypes';
import { initializeBoard, getPieceAtPosition, getValidMovesForPiece, makeMove } from '@/utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useOnlineGame } from '@/hooks/useOnlineGame';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, ChevronLeft, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const OnlineGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
  const [board, setBoard] = useState<ChessBoardType>(initializeBoard());
  const [waitingForOpponent, setWaitingForOpponent] = useState(true);
  const isMobile = useIsMobile();
  
  const { 
    isConnected, 
    isPlayerTurn, 
    opponentConnected,
    updateGameState, 
    subscribeToGameChanges,
    joinGame
  } = useOnlineGame(gameId || '');
  
  useEffect(() => {
    if (!gameId) return;
    
    // Join or create the game when component mounts
    const setupGame = async () => {
      try {
        const { color, initialBoard, opponentJoined } = await joinGame();
        setPlayerColor(color);
        
        if (initialBoard) {
          setBoard(initialBoard);
        }
        
        if (opponentJoined) {
          setWaitingForOpponent(false);
          toast({
            title: "Game started!",
            description: `You are playing as ${color === 'white' ? 'White' : 'Black'}.`
          });
        }
      } catch (error) {
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
      setBoard(newBoard);
      setWaitingForOpponent(false);
      
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
  
  // Check if it's the current player's turn
  const isTurnToPlay = playerColor === board.currentTurn && !waitingForOpponent;
  
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
    // In a real game, we would update the game state to mark it as resigned
    toast({
      title: "Game Forfeit",
      description: `You resigned the game. ${playerColor === 'white' ? 'Black' : 'White'} wins.`,
      variant: "destructive"
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-chess-background p-4">
      <motion.div 
        className="mb-6 w-full max-w-6xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            className="text-white/70 hover:text-white mr-2" 
            onClick={() => navigate('/multiplayer')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Lobby
          </Button>
          
          <div className="flex items-center ml-auto">
            <div className="flex items-center mr-4 bg-neutral-800 py-1 px-3 rounded">
              <span className="text-neutral-400 text-sm mr-2">Game ID:</span>
              <span className="font-mono text-white">{gameId}</span>
              <Button variant="ghost" size="icon" className="ml-1 h-6 w-6" onClick={copyGameId}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {waitingForOpponent ? (
          <motion.div 
            className="bg-neutral-800 p-3 rounded-lg text-amber-500 mb-4 flex items-center"
            animate={{ 
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Clock className="mr-2 h-4 w-4 animate-pulse" />
            Waiting for opponent to join...
          </motion.div>
        ) : !opponentConnected ? (
          <div className="bg-neutral-800 p-3 rounded-lg text-red-500 mb-4 flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Opponent disconnected. Waiting for reconnection...
          </div>
        ) : (
          <div className="bg-neutral-800 p-3 rounded-lg mb-4 flex items-center">
            <Users className="mr-2 h-4 w-4 text-emerald-500" />
            <span className={`font-medium ${isTurnToPlay ? 'text-emerald-500' : 'text-amber-500'}`}>
              {isTurnToPlay ? "Your turn" : "Opponent's turn"}
            </span>
            <span className="mx-2 text-neutral-500">•</span>
            <span className="text-white">Playing as {playerColor === 'white' ? 'White' : 'Black'}</span>
          </div>
        )}
      </motion.div>
      
      <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-6xl">
        <motion.div 
          className="w-full lg:w-2/3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-2 bg-neutral-900 border-neutral-700">
            <CardContent className="p-0">
              <ChessBoard 
                board={board} 
                onSquareClick={handleSquareClick}
                flipped={flippedBoard}
              />
            </CardContent>
          </Card>
        </motion.div>
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
          />
        </motion.div>
      </div>
    </div>
  );
};

export default OnlineGame;
