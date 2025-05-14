
import React from "react";
import { useNavigate } from "react-router-dom";
import ChessGame from "@/components/ChessGame";
import { Button } from "@/components/ui/button";
import { User, Users, Book, Trophy, ArrowRight, Clock, Brain } from "lucide-react";
import { motion } from "framer-motion";

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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              Chess <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200">Master</span>
            </h1>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
              Experience the ultimate chess game with modern design, online multiplayer, and intuitive gameplay.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/multiplayer')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-6 text-lg"
                  size="lg"
                >
                  Play Online <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => window.scrollTo({ top: document.getElementById('try-now')?.offsetTop, behavior: 'smooth' })}
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                  size="lg"
                >
                  Play Locally
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Game Features</h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 hover:border-amber-500/30 transition-colors"
          >
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 mx-auto">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Online Multiplayer</h3>
            <p className="text-neutral-400 text-center">Challenge friends or random opponents to test your skills in real-time matches.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 hover:border-amber-500/30 transition-colors"
          >
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 mx-auto">
              <User className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Local Play</h3>
            <p className="text-neutral-400 text-center">Play chess on the same device with a friend or family member.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 hover:border-amber-500/30 transition-colors"
          >
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 mx-auto">
              <Book className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Move History</h3>
            <p className="text-neutral-400 text-center">Review your game with detailed move history and notation.</p>
          </motion.div>
        </div>
      </div>
      
      {/* Additional Features */}
      <div className="container mx-auto px-4 py-16 bg-neutral-900/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 flex items-center"
          >
            <div className="rounded-full bg-amber-500/10 p-3 mr-4">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Competitive Play</h4>
              <p className="text-sm text-neutral-400">Test your skills against players worldwide</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 flex items-center"
          >
            <div className="rounded-full bg-amber-500/10 p-3 mr-4">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Timed Matches</h4>
              <p className="text-sm text-neutral-400">Play with various time controls</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-6 flex items-center"
          >
            <div className="rounded-full bg-amber-500/10 p-3 mr-4">
              <Brain className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Learn & Improve</h4>
              <p className="text-sm text-neutral-400">Review games and analyze your moves</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-6 flex items-center"
          >
            <div className="rounded-full bg-amber-500/10 p-3 mr-4">
              <svg className="h-6 w-6 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6.5L9 10H15L12 6.5Z" fill="currentColor"/>
                <path d="M12 17.5L9 14H15L12 17.5Z" fill="currentColor"/>
                <path d="M7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" fill="currentColor"/>
                <path d="M19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12Z" fill="currentColor"/>
                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Beautiful Interface</h4>
              <p className="text-sm text-neutral-400">Enjoy an elegant, modern chess experience</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Game Preview */}
      <div id="try-now" className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Try It Now</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Play a quick local game below or create an online match to challenge friends
          </p>
        </motion.div>
        
        <ChessGame />
        
        <div className="mt-12 text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button 
              onClick={() => navigate('/multiplayer')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-6 text-lg"
              size="lg"
            >
              Play Online Now <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
