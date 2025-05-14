
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Users, ArrowRight, Clock, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="min-h-screen bg-chess-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="text-white/70 hover:text-white mr-4" 
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-white">Chess Multiplayer</h1>
        </div>
        
        <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 rounded-xl shadow-2xl border border-neutral-700/50 backdrop-blur-sm">
          <Tabs defaultValue="create" className="w-full">
            <div className="p-4 border-b border-neutral-700/50">
              <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
                <TabsTrigger value="create">Create Game</TabsTrigger>
                <TabsTrigger value="join">Join Game</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="create" className="p-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create a New Game</h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                  Generate a unique game code and share it with someone you want to play with
                </p>
              </div>
              
              <Button 
                className="w-full py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 mb-8" 
                onClick={createGame}
                size="lg"
              >
                Generate Game Code
              </Button>
              
              {createdGameId && (
                <Card className="border border-emerald-500/30 bg-neutral-800/70 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-emerald-500">Game Created!</CardTitle>
                    <CardDescription>Share this code with your opponent:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-neutral-700 p-4 rounded-md flex-1 text-center text-white font-mono text-3xl tracking-wider">
                          {createdGameId}
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-12 w-12 bg-neutral-700 border-neutral-600" 
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-2" 
                      onClick={() => navigate(`/game/${createdGameId}`)}
                    >
                      Start Game <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="join" className="p-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Join an Existing Game</h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                  Enter the game code shared with you to join a match
                </p>
              </div>
              
              <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 mb-6">
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Enter Game Code:
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    className="flex-1 text-lg font-mono bg-neutral-700 border-neutral-600 text-white"
                    placeholder="Enter 6-digit code"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value.toUpperCase())}
                  />
                  <Button 
                    onClick={joinGame}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Join
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-neutral-500 text-sm">
                Don't have a game code? Ask a friend to create a game and share their code with you.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGame;
