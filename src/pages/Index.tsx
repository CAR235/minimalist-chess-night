
import React from "react";
import { useNavigate } from "react-router-dom";
import ChessGame from "@/components/ChessGame";
import { Button } from "@/components/ui/button";
import { User, Users, Book } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-chess-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-chess-background to-neutral-900 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMGgzMHYzMGgtMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PHBhdGggZD0iTTMwIDBsMzAgMzBIMzB6TTAgMzBsMzAgMzBIMHoiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] bg-center"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              Chess <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200">Master</span>
            </h1>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
              Experience the ultimate chess game with modern design, online multiplayer, and intuitive gameplay.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => navigate('/multiplayer')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-6 text-lg"
                size="lg"
              >
                Play Online
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                size="lg"
              >
                Play Locally
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Game Features</h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 hover:border-amber-500/30 transition-colors">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 mx-auto">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Online Multiplayer</h3>
            <p className="text-neutral-400 text-center">Challenge friends or random opponents to test your skills in real-time matches.</p>
          </div>
          
          <div className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 hover:border-amber-500/30 transition-colors">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 mx-auto">
              <User className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Local Play</h3>
            <p className="text-neutral-400 text-center">Play chess on the same device with a friend or family member.</p>
          </div>
          
          <div className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 hover:border-amber-500/30 transition-colors">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 mx-auto">
              <Book className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Move History</h3>
            <p className="text-neutral-400 text-center">Review your game with detailed move history and notation.</p>
          </div>
        </div>
      </div>
      
      {/* Game Preview */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Try It Now</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Play a quick local game below or create an online match to challenge friends
          </p>
        </div>
        
        <ChessGame />
      </div>
    </div>
  );
};

export default Index;
