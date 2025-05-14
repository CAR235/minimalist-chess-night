
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Users, ArrowRight, Clock, ChevronLeft, ChevronsRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const MultiplayerGame: React.FC = () => {
  const [gameId, setGameId] = useState<string>('');
  const [createdGameId, setCreatedGameId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate a unique game ID
  const createGame = async () => {
    try {
      setIsLoading(true);
      // Generate a random 6-character code
      const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCreatedGameId(randomId);
      
      toast({
        title: "Game Created!",
        description: "Share this code with your opponent to start playing.",
      });
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error",
        description: "Failed to create a game. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Join an existing game
  const joinGame = async () => {
    if (!gameId) {
      toast({
        title: "Error",
        description: "Please enter a game ID to join.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if the game exists in Supabase
      const { data } = await supabase
        .from('chess_games')
        .select('id')
        .eq('id', gameId)
        .single();
      
      // If the game doesn't exist, it will be created when navigating to the game page
      navigate(`/game/${gameId}`);
    } catch (error) {
      // If there's an error, still navigate to create a new game with this ID
      navigate(`/game/${gameId}`);
    } finally {
      setIsLoading(false);
    }
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

  // Creating floating pieces for background animation
  const floatingPieces = [
    { piece: '♟', delay: 0, x: '10%', y: '10%' },
    { piece: '♞', delay: 1.2, x: '80%', y: '15%' },
    { piece: '♝', delay: 0.8, x: '20%', y: '80%' },
    { piece: '♜', delay: 2, x: '85%', y: '75%' },
    { piece: '♛', delay: 1.5, x: '50%', y: '25%' },
    { piece: '♚', delay: 0.5, x: '65%', y: '90%' },
  ];

  return (
    <div className="min-h-screen bg-chess-background relative overflow-hidden">
      {/* Animated background pieces */}
      {floatingPieces.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-5 pointer-events-none text-white"
          initial={{ x: item.x, y: item.y, opacity: 0 }}
          animate={{ 
            opacity: 0.05, 
            y: [`${parseFloat(item.y) - 5}%`, `${parseFloat(item.y) + 5}%`, `${parseFloat(item.y) - 5}%`]
          }}
          transition={{
            y: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay
            },
            opacity: { duration: 2, delay: item.delay }
          }}
        >
          {item.piece}
        </motion.div>
      ))}

      {/* Main content */}
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
        
        <motion.div 
          className="bg-gradient-to-br from-neutral-800/90 to-neutral-900/95 rounded-xl shadow-2xl border border-neutral-700/50 backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="create" className="w-full">
            <div className="p-4 border-b border-neutral-700/50">
              <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
                <TabsTrigger value="create" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">Create Game</TabsTrigger>
                <TabsTrigger value="join" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Join Game</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="create" className="p-6">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create a New Game</h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                  Generate a unique game code and share it with someone you want to play with
                </p>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  className="w-full py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 mb-8 group" 
                  onClick={createGame}
                  size="lg"
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Generating..." : "Generate Game Code"}</span>
                  <ChevronsRight className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              {createdGameId && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
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
                            className="h-12 w-12 bg-neutral-700 border-neutral-600 hover:bg-neutral-600 hover:text-emerald-400 transition-all" 
                            onClick={copyToClipboard}
                          >
                            <Copy className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800" 
                        onClick={() => navigate(`/game/${createdGameId}`)}
                      >
                        Start Game <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="join" className="p-6">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/20 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Join an Existing Game</h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                  Enter the game code shared with you to join a match
                </p>
              </motion.div>
              
              <motion.div
                className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Joining..." : "Join"}
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                className="text-center text-neutral-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Don't have a game code? Ask a friend to create a game and share their code with you.
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default MultiplayerGame;
