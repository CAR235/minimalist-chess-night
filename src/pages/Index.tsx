
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Users } from "lucide-react";

export default function Home() {
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  
  // Generate a random number of online players
  useEffect(() => {
    // Initial random number between 30 and 130
    const getRandomPlayerCount = () => Math.floor(Math.random() * (130 - 30 + 1) + 30);
    setOnlinePlayers(getRandomPlayerCount());
    
    // Update the count every 20 seconds
    const interval = setInterval(() => {
      // Random change between +/- 10 to 25 players
      const change = Math.floor(Math.random() * (25 - 10 + 1) + 10);
      const increase = Math.random() > 0.5;
      
      setOnlinePlayers(prev => {
        // Ensure count stays within bounds
        const newCount = increase ? prev + change : prev - change;
        if (newCount < 30) return 30 + Math.floor(Math.random() * 10);
        if (newCount > 130) return 130 - Math.floor(Math.random() * 10);
        return newCount;
      });
    }, 20000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#121620] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white">Chess</span>
          <span className="text-amber-400">Master</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Experience the ultimate chess gameplay with an<br />
          elegant, modern interface
        </motion.p>
        
        <motion.div
          className="text-emerald-400 mb-12 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Users size={18} />
          <span>{onlinePlayers} players online now</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/multiplayer">
            <Button className="px-8 py-6 text-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2">
              Play Online <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/play-local">
            <Button className="px-8 py-6 text-lg bg-neutral-800 hover:bg-neutral-700 text-white">
              Play Locally
            </Button>
          </Link>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-16 flex items-center justify-center gap-8 opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-white text-3xl">♞</div>
        <div className="text-white text-3xl">♟</div>
        <div className="text-white text-3xl">♚</div>
        <div className="text-white text-3xl">♜</div>
        <div className="text-white text-3xl">♛</div>
      </motion.div>
    </div>
  );
}
