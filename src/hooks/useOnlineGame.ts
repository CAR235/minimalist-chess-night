
import { useState, useCallback, useEffect, useRef } from 'react';
import { ChessBoard, PieceColor, deserializeChessBoard, serializeChessBoard } from '@/models/ChessTypes';
import { initializeBoard } from '@/utils/chessUtils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useOnlineGame = (gameId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [opponentConnected, setOpponentConnected] = useState(false);
  const playerIdRef = useRef(`player-${Math.random().toString(36).substring(2, 9)}`);
  const playerColorRef = useRef<PieceColor | null>(null);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(true);
  
  // Check current auth status
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      } else {
        // For demo purposes, generate a random ID when not authenticated
        setUserId(playerIdRef.current);
      }
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Join or create a game
  const joinGame = useCallback(async () => {
    if (!gameId || !userId) return { color: 'white' as PieceColor, initialBoard: null, opponentJoined: false };
    
    try {
      // Check if the game exists
      const { data: existingGame } = await supabase
        .from('chess_games')
        .select('*')
        .eq('id', gameId)
        .single();
      
      let game = existingGame;
      let color: PieceColor = 'white';
      let opponentJoined = false;
      
      // If game exists
      if (game) {
        console.log("Game exists, checking player assignments:", game);
        
        // Determine which color the player will be
        if (!game.white_player && !game.black_player) {
          // First player joins - automatically white
          await supabase
            .from('chess_games')
            .update({ white_player: userId })
            .eq('id', gameId);
          color = 'white';
          opponentJoined = false;
          console.log("First player joining as white");
        } else if (!game.white_player) {
          // White slot available
          await supabase
            .from('chess_games')
            .update({ white_player: userId })
            .eq('id', gameId);
          color = 'white';
          opponentJoined = !!game.black_player;
          console.log("Joining as white, black exists:", !!game.black_player);
        } else if (!game.black_player) {
          // Black slot available
          await supabase
            .from('chess_games')
            .update({ black_player: userId })
            .eq('id', gameId);
          color = 'black';
          opponentJoined = true;
          console.log("Joining as black, white exists:", !!game.white_player);
        } else if (game.white_player === userId) {
          // Player is already white
          color = 'white';
          opponentJoined = !!game.black_player;
          console.log("Already white, black exists:", !!game.black_player);
        } else if (game.black_player === userId) {
          // Player is already black
          color = 'black';
          opponentJoined = !!game.white_player;
          console.log("Already black, white exists:", !!game.white_player);
        } else {
          // Game is full, but allow spectating
          color = 'white'; // spectator defaults to white view
          opponentJoined = true;
          console.log("Game full, spectating as white");
        }
        
        // Re-fetch the updated game data
        const { data: updatedGame } = await supabase
          .from('chess_games')
          .select('*')
          .eq('id', gameId)
          .single();
        
        if (updatedGame) {
          game = updatedGame;
          // Update opponent connection status based on fresh data
          if (color === 'white') {
            opponentJoined = !!updatedGame.black_player;
          } else {
            opponentJoined = !!updatedGame.white_player;
          }
          console.log("Updated game data:", updatedGame, "opponent joined:", opponentJoined);
        }
      } else {
        // Create a new game
        const initialBoard = initializeBoard();
        await supabase
          .from('chess_games')
          .insert({
            id: gameId,
            board: serializeChessBoard(initialBoard),
            white_player: userId,
            current_turn: 'white',
            is_checkmate: false,
            is_check: false
          });
        
        // Get the created game
        const { data: newGame } = await supabase
          .from('chess_games')
          .select('*')
          .eq('id', gameId)
          .single();
        
        if (newGame) {
          game = newGame;
          color = 'white';
          console.log("Created new game as white");
        }
      }
      
      playerColorRef.current = color;
      setIsConnected(true);
      setOpponentConnected(opponentJoined);
      setWaitingForOpponent(!opponentJoined);
      setIsPlayerTurn(color === 'white'); // white goes first
      
      console.log(`Joined game ${gameId} as ${color}, opponent connected: ${opponentJoined}`);
      
      // Return game data
      return {
        color,
        initialBoard: game?.board ? deserializeChessBoard(game.board) : null,
        opponentJoined
      };
    } catch (error) {
      console.error('Error joining game:', error);
      toast({
        title: "Error",
        description: "Failed to join the game. Please try again.",
        variant: "destructive"
      });
      return { color: 'white' as PieceColor, initialBoard: null, opponentJoined: false };
    }
  }, [gameId, userId, toast]);
  
  // Update the game state
  const updateGameState = useCallback(async (newBoard: ChessBoard) => {
    if (!gameId || !isConnected) return;
    
    try {
      await supabase
        .from('chess_games')
        .update({
          board: serializeChessBoard(newBoard),
          current_turn: newBoard.currentTurn,
          is_checkmate: newBoard.isCheckmate,
          is_check: newBoard.isCheck,
          updated_at: new Date().toISOString()
        })
        .eq('id', gameId);
      
      // Update local state
      setIsPlayerTurn(newBoard.currentTurn === playerColorRef.current);
    } catch (error) {
      console.error('Error updating game state:', error);
      toast({
        title: "Error",
        description: "Failed to update the game state. Please try again.",
        variant: "destructive"
      });
    }
  }, [gameId, isConnected, toast]);
  
  // Subscribe to game changes
  const subscribeToGameChanges = useCallback((callback: (board: ChessBoard) => void) => {
    if (!gameId) return () => {};
    
    // Subscribe to realtime changes on the chess_games table
    const channel = supabase
      .channel(`public:chess_games:id=eq.${gameId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'chess_games',
        filter: `id=eq.${gameId}`
      }, (payload) => {
        const updatedGame = payload.new;
        if (updatedGame?.board) {
          const deserializedBoard = deserializeChessBoard(updatedGame.board);
          callback(deserializedBoard);
          
          // Update player turn status
          setIsPlayerTurn(deserializedBoard.currentTurn === playerColorRef.current);
        }

        // Check if opponent has connected or disconnected
        if (playerColorRef.current === 'white' && updatedGame?.black_player) {
          setOpponentConnected(true);
          setWaitingForOpponent(false);
          console.log("Black player joined, no longer waiting");
        } else if (playerColorRef.current === 'black' && updatedGame?.white_player) {
          setOpponentConnected(true);
          setWaitingForOpponent(false);
          console.log("White player joined, no longer waiting");
        }
      })
      .subscribe();
    
    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);
  
  // Check opponent connection status
  useEffect(() => {
    if (!gameId || !isConnected || !playerColorRef.current) return;
    
    const checkOpponentStatus = async () => {
      const { data: game } = await supabase
        .from('chess_games')
        .select('white_player, black_player')
        .eq('id', gameId)
        .single();
      
      if (game) {
        const isWhitePlayer = playerColorRef.current === 'white';
        const opponentExists = isWhitePlayer ? !!game.black_player : !!game.white_player;
        
        setOpponentConnected(opponentExists);
        setWaitingForOpponent(!opponentExists);
        
        console.log(`Status check: I am ${isWhitePlayer ? 'white' : 'black'}, opponent exists: ${opponentExists}`);
      }
    };
    
    // Check immediately and then every 3 seconds
    checkOpponentStatus();
    const interval = setInterval(checkOpponentStatus, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [gameId, isConnected]);
  
  return {
    isConnected,
    isPlayerTurn,
    opponentConnected,
    waitingForOpponent,
    joinGame,
    updateGameState,
    subscribeToGameChanges,
  };
};
