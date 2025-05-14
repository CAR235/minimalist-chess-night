import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [onlinePlayers, setOnlinePlayers] = useState<number>(0);

  // Generate random online player count
  useEffect(() => {
    // Initial random count between 30 and 130
    const initialCount = Math.floor(Math.random() * (130 - 30 + 1)) + 30;
    setOnlinePlayers(initialCount);

    // Update count every 20 seconds
    const interval = setInterval(() => {
      const changeAmount = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
      const increase = Math.random() > 0.5;
      
      setOnlinePlayers(prevCount => {
        let newCount = increase 
          ? prevCount + changeAmount 
          : prevCount - changeAmount;
        
        // Keep within range 30-130
        newCount = Math.max(30, Math.min(130, newCount));
        return newCount;
      });
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-chess-background to-neutral-900 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center gap-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tight leading-tight"
          >
            <span className="text-white">Chess</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-100 ml-3">Master</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 md:mt-10 max-w-md mx-auto"
          >
            <p className="text-lg md:text-xl text-neutral-300/90">
              Experience the ultimate chess gameplay with an elegant, modern interface
            </p>
          </motion.div>

          {/* Online players count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 flex items-center justify-center gap-2 text-emerald-400"
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">{onlinePlayers} players online now</span>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 w-full max-w-md justify-center mt-4"
        >
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto"
          >
            <Button 
              onClick={() => navigate('/multiplayer')}
              className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-7 text-lg rounded-xl shadow-lg shadow-amber-500/20"
              size="lg"
            >
              Play Online <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto"
          >
            <Button 
              onClick={() => navigate('/local-game')}
              variant="outline"
              className="w-full md:w-auto border-white/10 hover:bg-white/5 text-white px-8 py-7 text-lg rounded-xl"
              size="lg"
            >
              Play Locally
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Chess Piece Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="relative w-full max-w-lg h-20 mt-8"
        >
          {['♟︎', '♞', '♜', '♛', '♚', '♝'].map((piece, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl md:text-5xl text-white/80"
              initial={{ 
                x: Math.random() * 100 - 50,
                y: -20, 
                opacity: 0 
              }}
              animate={{ 
                x: [null, Math.random() * 300 - 150], 
                y: [null, 0],
                opacity: [0, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              style={{ left: `${(index + 1) * 14}%` }}
            >
              {piece}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
