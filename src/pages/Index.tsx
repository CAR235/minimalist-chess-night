
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, ArrowRight } from "lucide-react";

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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white">Chess</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">Master</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-300 max-w-2xl mx-auto"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Challenge your mind with the ultimate game of strategy and skill
          </motion.p>
          
          <motion.div
            className="text-amber-300 mt-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Users size={16} />
            <span>{onlinePlayers} players online</span>
          </motion.div>
        </div>

        {/* Game modes */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Online Game */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-xl h-full bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm border-t border-blue-500/20">
              <CardContent className="p-0">
                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Online Play</h2>
                  <p className="text-slate-300 mb-8">
                    Challenge friends or random opponents from around the world. Create a game and share the code to start playing.
                  </p>
                  <Link to="/multiplayer">
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full flex items-center justify-center gap-2 py-6 text-lg">
                      Play Online <ArrowRight className="h-5 w-5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Local Game */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-xl h-full bg-gradient-to-br from-amber-900/40 to-amber-950/40 backdrop-blur-sm border-t border-amber-500/20">
              <CardContent className="p-0">
                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Local Play</h2>
                  <p className="text-slate-300 mb-8">
                    Play chess on the same device with a friend or family member. Perfect for learning and casual games.
                  </p>
                  <Link to="/play-local">
                    <Button className="bg-amber-600 hover:bg-amber-700 w-full flex items-center justify-center gap-2 py-6 text-lg">
                      Play Locally <ArrowRight className="h-5 w-5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Feature 1 */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-xl font-bold mb-2 text-white">Intuitive Interface</h3>
            <p className="text-slate-400">Easy-to-use chess board with move highlighting and drag-and-drop functionality.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-xl font-bold mb-2 text-white">Real-time Gameplay</h3>
            <p className="text-slate-400">Instant updates and notifications for a seamless multiplayer experience.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-xl font-bold mb-2 text-white">Move History</h3>
            <p className="text-slate-400">Review the game with detailed move history and position analysis.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
