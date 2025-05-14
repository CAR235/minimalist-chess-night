
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Copy } from 'lucide-react';

const MultiplayerGame: React.FC = () => {
  const [gameId, setGameId] = useState<string>('');
  const [createdGameId, setCreatedGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate a unique game ID
  const createGame = () => {
    // Generate a random 6-character code
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreatedGameId(randomId);
    toast({
      title: "Game Created!",
      description: "Share this code with your opponent to start playing.",
    });
  };

  // Join an existing game
  const joinGame = () => {
    if (!gameId) {
      toast({
        title: "Error",
        description: "Please enter a game ID to join.",
        variant: "destructive"
      });
      return;
    }

    navigate(`/game/${gameId}`);
  };

  // Copy game ID to clipboard
  const copyToClipboard = () => {
    if (createdGameId) {
      navigator.clipboard.writeText(createdGameId);
      toast({
        title: "Copied!",
        description: "Game ID copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-chess-background p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Chess Multiplayer</h1>
      
      <div className="bg-neutral-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Create a New Game</h2>
          <Button 
            className="w-full" 
            onClick={createGame}
          >
            Create Game
          </Button>
          
          {createdGameId && (
            <div className="mt-4 p-4 bg-neutral-700 rounded-md">
              <p className="text-sm text-neutral-300 mb-2">Share this code with your opponent:</p>
              <div className="flex items-center gap-2">
                <div className="bg-neutral-600 p-2 rounded-md flex-1 text-center text-white font-mono text-xl">
                  {createdGameId}
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={() => navigate(`/game/${createdGameId}`)}
              >
                Start Game
              </Button>
            </div>
          )}
        </div>
        
        <div className="border-t border-neutral-700 my-6 pt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Join Existing Game</h2>
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder="Enter game code"
              value={gameId}
              onChange={(e) => setGameId(e.target.value.toUpperCase())}
            />
            <Button onClick={joinGame}>Join</Button>
          </div>
        </div>
      </div>
      
      <Button 
        variant="link" 
        className="mt-8 text-neutral-400 hover:text-white"
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default MultiplayerGame;
