
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-[url('/chess-bg.jpg')] bg-cover bg-center">
      <div className="flex-1 flex flex-col justify-center items-center p-4 backdrop-blur-sm bg-black/40">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-6">
              Chess<span className="text-amber-400">Master</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Play chess online or locally with friends
            </p>
            <div className="text-green-400 mb-8">
              {onlinePlayers} players online now
            </div>
          </div>
          
          <div className="space-y-4">
            <Link to="/multiplayer" className="w-full block">
              <Button className="w-full py-6 bg-amber-500 hover:bg-amber-600 text-xl">
                Play Online <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/local-game" className="w-full block">
              <Button variant="outline" className="w-full py-6 text-white bg-transparent border-white hover:bg-white/10 text-xl">
                Play Locally
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
