
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChessBoard from '@/components/ChessBoard';
import GameInfo from '@/components/GameInfo';
import { Position, ChessBoard as ChessBoardType, PieceColor } from '@/models/ChessTypes';
import { initializeBoard, getPieceAtPosition, getValidMovesForPiece, makeMove } from '@/utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useOnlineGame } from '@/hooks/useOnlineGame';

const OnlineGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
  const [board, setBoard] = useState<ChessBoardType>(initializeBoard());
  const [waitingForOpponent, setWaitingForOpponent] = useState(true);
  
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
    const newBoard = initializeBoard();
    setBoard(newBoard);
    updateGameState(newBoard);
    toast({
      title: "New Game",
      description: "The board has been reset. White moves first.",
    });
  };
  
  // Display board with proper orientation based on player color
  const flippedBoard = playerColor === 'black';
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-chess-background p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Online Chess Game</h1>
        <div className="text-neutral-400 text-sm mb-4">Game Code: <span className="font-mono text-white">{gameId}</span></div>
        
        {waitingForOpponent ? (
          <div className="bg-neutral-800 p-3 rounded-lg text-amber-500 mb-4">
            Waiting for opponent to join...
          </div>
        ) : !opponentConnected ? (
          <div className="bg-neutral-800 p-3 rounded-lg text-red-500 mb-4">
            Opponent disconnected. Waiting for reconnection...
          </div>
        ) : (
          <div className="bg-neutral-800 p-3 rounded-lg text-emerald-500 mb-4">
            {isTurnToPlay ? "Your turn" : "Opponent's turn"}
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto">
        <ChessBoard 
          board={board} 
          onSquareClick={handleSquareClick}
          flipped={flippedBoard}
        />
        <GameInfo 
          board={board} 
          onReset={handleReset}
        />
        
        <div className="flex gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/multiplayer')}
          >
            Back to Lobby
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnlineGame;
