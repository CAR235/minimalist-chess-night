
import { useState, useCallback, useEffect, useRef } from 'react';
import { ChessBoard, PieceColor } from '@/models/ChessTypes';
import { initializeBoard } from '@/utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';

// In a real implementation, this would be replaced with Supabase client
type GameState = {
  board: ChessBoard;
  players: {
    white?: string;
    black?: string;
  };
  lastUpdate: number;
};

// Mock in-memory database for demonstration purposes
// In production, this would be replaced with Supabase real-time subscriptions
const activeGames: Record<string, GameState> = {};
const gameSubscribers: Record<string, ((board: ChessBoard) => void)[]> = {};

export const useOnlineGame = (gameId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [opponentConnected, setOpponentConnected] = useState(false);
  const playerIdRef = useRef(`player-${Math.random().toString(36).substring(2, 9)}`);
  const playerColorRef = useRef<PieceColor | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Display a notice about demo mode
    toast({
      title: "Demo Mode",
      description: "This is a demo of the multiplayer feature. For persistent real-time games, connect this project to Supabase.",
    });
  }, [toast]);
  
  // Join or create a game
  const joinGame = useCallback(async () => {
    // This function would normally make a call to Supabase to join a game
    // For now, we'll simulate this with our in-memory storage
    
    let game = activeGames[gameId];
    let color: PieceColor = 'white';
    let opponentJoined = false;
    
    // If game exists
    if (game) {
      // Determine which color the player will be
      if (!game.players.white) {
        game.players.white = playerIdRef.current;
        color = 'white';
        opponentJoined = !!game.players.black;
      } else if (!game.players.black) {
        game.players.black = playerIdRef.current;
        color = 'black';
        opponentJoined = true;
      } else {
        // Game is full, but allow spectating
        // In a real app, you'd handle this differently
        color = 'white'; // spectator defaults to white view
      }
    } else {
      // Create a new game
      game = {
        board: initializeBoard(),
        players: { white: playerIdRef.current },
        lastUpdate: Date.now()
      };
      activeGames[gameId] = game;
    }
    
    playerColorRef.current = color;
    setIsConnected(true);
    setOpponentConnected(opponentJoined);
    setIsPlayerTurn(color === 'white'); // white goes first
    
    console.log(`Joined game ${gameId} as ${color}`);
    
    // Return game data
    return {
      color,
      initialBoard: game.board,
      opponentJoined
    };
  }, [gameId]);
  
  // Update the game state
  const updateGameState = useCallback((newBoard: ChessBoard) => {
    // This would normally be a call to update the Supabase database
    if (!gameId || !isConnected) return;
    
    // Update the in-memory game state
    if (activeGames[gameId]) {
      activeGames[gameId].board = newBoard;
      activeGames[gameId].lastUpdate = Date.now();
      
      // Notify all subscribers
      if (gameSubscribers[gameId]) {
        gameSubscribers[gameId].forEach(callback => {
          callback(newBoard);
        });
      }
      
      // Update local state
      setIsPlayerTurn(newBoard.currentTurn === playerColorRef.current);
    }
  }, [gameId, isConnected]);
  
  // Subscribe to game changes
  const subscribeToGameChanges = useCallback((callback: (board: ChessBoard) => void) => {
    // This would normally be a Supabase subscription
    if (!gameId) return () => {};
    
    if (!gameSubscribers[gameId]) {
      gameSubscribers[gameId] = [];
    }
    
    gameSubscribers[gameId].push(callback);
    
    // Return unsubscribe function
    return () => {
      if (gameSubscribers[gameId]) {
        gameSubscribers[gameId] = gameSubscribers[gameId].filter(cb => cb !== callback);
      }
    };
  }, [gameId]);
  
  // Simulate opponent connection status check
  useEffect(() => {
    if (!gameId || !isConnected) return;
    
    const checkOpponentStatus = () => {
      const game = activeGames[gameId];
      if (game) {
        const isWhitePlayer = game.players.white === playerIdRef.current;
        const opponentExists = isWhitePlayer ? !!game.players.black : !!game.players.white;
        setOpponentConnected(opponentExists);
      }
    };
    
    const interval = setInterval(checkOpponentStatus, 2000);
    checkOpponentStatus(); // Check immediately
    
    return () => {
      clearInterval(interval);
    };
  }, [gameId, isConnected]);
  
  return {
    isConnected,
    isPlayerTurn,
    opponentConnected,
    joinGame,
    updateGameState,
    subscribeToGameChanges,
  };
};
