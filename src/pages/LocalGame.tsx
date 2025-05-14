
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieceColor } from '@/models/ChessTypes';
import { ChevronLeft } from 'lucide-react';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'grandmaster';

interface DifficultyOption {
  value: DifficultyLevel;
  label: string;
  description: string;
}

const difficultyOptions: DifficultyOption[] = [
  { 
    value: 'beginner', 
    label: 'Rookie', 
    description: 'Perfect for beginners learning chess basics.' 
  },
  { 
    value: 'intermediate', 
    label: 'Club Player', 
    description: 'Challenging for casual players.' 
  },
  { 
    value: 'advanced', 
    label: 'Master', 
    description: 'Strong tactical play. Prepare to be challenged.' 
  },
  { 
    value: 'grandmaster', 
    label: 'Chess Engine', 
    description: 'Exceptionally strong. Only for experienced players.' 
  },
];

const LocalGame: React.FC = () => {
  const navigate = useNavigate();
  const [playerColor, setPlayerColor] = useState<PieceColor>('white');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  
  const handleStartGame = () => {
    navigate('/play-local', { 
      state: { 
        playerColor, 
        difficulty 
      } 
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-chess-background to-neutral-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        <Button 
          variant="ghost" 
          className="text-white/70 hover:text-white mb-6" 
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="bg-neutral-900/90 border-neutral-800 backdrop-blur-sm">
          <CardHeader className="border-b border-neutral-800 pb-4">
            <CardTitle className="text-2xl text-amber-400">Play Local Game</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Choose your color</h3>
              <RadioGroup 
                defaultValue="white" 
                className="grid grid-cols-2 gap-4" 
                onValueChange={(value) => setPlayerColor(value as PieceColor)}
              >
                <div>
                  <RadioGroupItem 
                    value="white" 
                    id="white" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="white"
                    className="flex flex-col items-center justify-between p-4 border rounded-md border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer peer-data-[state=checked]:border-amber-400 peer-data-[state=checked]:bg-amber-400/10"
                  >
                    <div className="text-3xl mb-2">♟️</div>
                    <span className="font-medium">White</span>
                    <span className="text-xs text-neutral-400 mt-1">First move</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="black" 
                    id="black" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="black"
                    className="flex flex-col items-center justify-between p-4 border rounded-md border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer peer-data-[state=checked]:border-amber-400 peer-data-[state=checked]:bg-amber-400/10"
                  >
                    <div className="text-3xl mb-2">♟︎</div>
                    <span className="font-medium">Black</span>
                    <span className="text-xs text-neutral-400 mt-1">Second move</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Select difficulty</h3>
              <Select 
                defaultValue="intermediate" 
                onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
              >
                <SelectTrigger className="w-full bg-neutral-800 border-neutral-700">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {difficulty && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded bg-amber-400/10 border border-amber-400/20 text-sm mt-2"
                >
                  {difficultyOptions.find(o => o.value === difficulty)?.description}
                </motion.div>
              )}
            </div>
            
            <Button 
              onClick={handleStartGame} 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 py-6 text-lg"
            >
              Start Game
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LocalGame;
