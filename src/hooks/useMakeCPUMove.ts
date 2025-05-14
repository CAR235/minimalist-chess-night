
import { useState, useCallback } from 'react';
import { ChessBoard, Piece, Position } from '@/models/ChessTypes';
import { getPieceAtPosition, getValidMovesForPiece, makeMove } from '@/utils/chessUtils';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'grandmaster';

// Custom hook for CPU moves with difficulty levels
export const useMakeCPUMove = (difficultyLevel: string = 'intermediate') => {
  // Convert string to proper difficulty level type
  const difficulty = (difficultyLevel as DifficultyLevel) || 'intermediate';
  
  // Calculate move score - higher is better for CPU
  const evaluateMove = (board: ChessBoard, from: Position, to: Position): number => {
    // Make a temporary move to evaluate the position
    const tempBoard = makeMove(board, from, to);
    const cpuColor = board.currentTurn;
    
    let score = 0;
    
    // Piece values
    const pieceValues = {
      'pawn': 1,
      'knight': 3,
      'bishop': 3,
      'rook': 5,
      'queen': 9,
      'king': 0 // The king's value isn't relevant for capture evaluation
    };
    
    // Basic material counting
    tempBoard.pieces.forEach(piece => {
      const value = pieceValues[piece.type];
      // Add value for CPU pieces, subtract for opponent pieces
      if (piece.color === cpuColor) {
        score += value;
      } else {
        score -= value;
      }
    });
    
    // Bonus for captures (encourages capturing)
    const capturedPiece = getPieceAtPosition(board, to);
    if (capturedPiece) {
      score += pieceValues[capturedPiece.type] * 1.2; // 20% bonus for captures
    }
    
    // Bonus for putting opponent in check
    if (tempBoard.isCheck) {
      score += 0.5;
    }
    
    // Huge bonus for checkmate
    if (tempBoard.isCheckmate) {
      score += 100;
    }
    
    // For advanced levels, consider center control
    if (difficulty === 'advanced' || difficulty === 'grandmaster') {
      // Center squares control bonus
      const centerSquares = [
        {row: 3, col: 3}, {row: 3, col: 4},
        {row: 4, col: 3}, {row: 4, col: 4}
      ];
      
      // Check if CPU pieces control center squares
      const cpuPieces = tempBoard.pieces.filter(p => p.color === cpuColor);
      cpuPieces.forEach(piece => {
        const controlledMoves = getValidMovesForPiece(tempBoard, piece);
        controlledMoves.forEach(move => {
          if (centerSquares.some(cs => cs.row === move.row && cs.col === move.col)) {
            score += 0.2; // Bonus for controlling center squares
          }
        });
      });
    }
    
    return score;
  };
  
  // Function to select a move based on difficulty level
  const makeCPUMove = useCallback((board: ChessBoard): ChessBoard => {
    const cpuColor = board.currentTurn;
    const cpuPieces = board.pieces.filter(piece => piece.color === cpuColor);
    const possibleMoves: {from: Position, to: Position, score: number}[] = [];
    
    // Get all possible moves with scores
    cpuPieces.forEach(piece => {
      const validMoves = getValidMovesForPiece(board, piece);
      validMoves.forEach(movePos => {
        const score = evaluateMove(board, piece.position, movePos);
        possibleMoves.push({
          from: piece.position,
          to: movePos,
          score
        });
      });
    });
    
    if (possibleMoves.length === 0) return board; // No valid moves
    
    // Sort moves by score, best first
    possibleMoves.sort((a, b) => b.score - a.score);
    
    let chosenMove;
    
    // Select move based on difficulty
    switch(difficulty) {
      case 'beginner':
        // Random move from the worst 60%
        const beginnerCutoff = Math.floor(possibleMoves.length * 0.4); 
        const beginnerMoves = possibleMoves.slice(beginnerCutoff);
        chosenMove = beginnerMoves[Math.floor(Math.random() * beginnerMoves.length)] || possibleMoves[0];
        break;
        
      case 'intermediate':
        // 70% chance to pick from the top 50% of moves, 30% chance to pick a random move
        if (Math.random() < 0.7) {
          const goodMovesCutoff = Math.ceil(possibleMoves.length * 0.5);
          const goodMoves = possibleMoves.slice(0, goodMovesCutoff);
          chosenMove = goodMoves[Math.floor(Math.random() * goodMoves.length)];
        } else {
          chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        break;
        
      case 'advanced':
        // 80% chance to pick from the top 30% of moves
        if (Math.random() < 0.8) {
          const topMovesCutoff = Math.ceil(possibleMoves.length * 0.3);
          const topMoves = possibleMoves.slice(0, topMovesCutoff);
          chosenMove = topMoves[Math.floor(Math.random() * topMoves.length)];
        } else {
          chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        break;
        
      case 'grandmaster':
      default:
        // Almost always pick the best move
        if (Math.random() < 0.9) {
          // Pick from top 3 moves for some variety
          const topN = Math.min(3, possibleMoves.length);
          chosenMove = possibleMoves[Math.floor(Math.random() * topN)];
        } else {
          // 10% chance to pick a random good move
          const topHalf = Math.ceil(possibleMoves.length * 0.5);
          const goodMoves = possibleMoves.slice(0, topHalf);
          chosenMove = goodMoves[Math.floor(Math.random() * goodMoves.length)];
        }
        break;
    }
    
    // Make the chosen move
    if (chosenMove) {
      return makeMove(board, chosenMove.from, chosenMove.to);
    }
    
    return board;
  }, [difficulty]);
  
  return makeCPUMove;
};
