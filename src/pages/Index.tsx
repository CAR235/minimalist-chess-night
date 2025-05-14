
import React from "react";
import { useNavigate } from "react-router-dom";
import ChessGame from "@/components/ChessGame";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-chess-background p-4">
      <h1 className="text-3xl font-bold mb-2 text-white">Chess Game</h1>
      <div className="flex gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/multiplayer')}
          className="text-white border-white hover:bg-white/10"
        >
          Play Online
        </Button>
        <Button 
          variant="default" 
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          Play Locally
        </Button>
      </div>
      <ChessGame />
    </div>
  );
};

export default Index;
