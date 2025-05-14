
import { Piece, PieceType, PieceColor, Position, ChessBoard, Move } from "../models/ChessTypes";

// Constants
export const BOARD_SIZE = 8;

// Initialize a new chess board
export const initializeBoard = (): ChessBoard => {
  const pieces: Piece[] = [];

  // Initialize pawns
  for (let col = 0; col < BOARD_SIZE; col++) {
    pieces.push({
      type: 'pawn',
      color: 'white',
      position: { row: 6, col },
      hasMoved: false,
      symbol: '♙'
    });
    pieces.push({
      type: 'pawn',
      color: 'black',
      position: { row: 1, col },
      hasMoved: false,
      symbol: '♟'
    });
  }

  // Initialize rooks
  pieces.push({ type: 'rook', color: 'white', position: { row: 7, col: 0 }, hasMoved: false, symbol: '♖' });
  pieces.push({ type: 'rook', color: 'white', position: { row: 7, col: 7 }, hasMoved: false, symbol: '♖' });
  pieces.push({ type: 'rook', color: 'black', position: { row: 0, col: 0 }, hasMoved: false, symbol: '♜' });
  pieces.push({ type: 'rook', color: 'black', position: { row: 0, col: 7 }, hasMoved: false, symbol: '♜' });

  // Initialize knights
  pieces.push({ type: 'knight', color: 'white', position: { row: 7, col: 1 }, symbol: '♘' });
  pieces.push({ type: 'knight', color: 'white', position: { row: 7, col: 6 }, symbol: '♘' });
  pieces.push({ type: 'knight', color: 'black', position: { row: 0, col: 1 }, symbol: '♞' });
  pieces.push({ type: 'knight', color: 'black', position: { row: 0, col: 6 }, symbol: '♞' });

  // Initialize bishops
  pieces.push({ type: 'bishop', color: 'white', position: { row: 7, col: 2 }, symbol: '♗' });
  pieces.push({ type: 'bishop', color: 'white', position: { row: 7, col: 5 }, symbol: '♗' });
  pieces.push({ type: 'bishop', color: 'black', position: { row: 0, col: 2 }, symbol: '♝' });
  pieces.push({ type: 'bishop', color: 'black', position: { row: 0, col: 5 }, symbol: '♝' });

  // Initialize queens
  pieces.push({ type: 'queen', color: 'white', position: { row: 7, col: 3 }, symbol: '♕' });
  pieces.push({ type: 'queen', color: 'black', position: { row: 0, col: 3 }, symbol: '♛' });

  // Initialize kings
  pieces.push({ type: 'king', color: 'white', position: { row: 7, col: 4 }, hasMoved: false, symbol: '♔' });
  pieces.push({ type: 'king', color: 'black', position: { row: 0, col: 4 }, hasMoved: false, symbol: '♚' });

  return {
    pieces,
    selectedPiece: null,
    validMoves: [],
    currentTurn: 'white',
    isCheck: false,
    isCheckmate: false,
    capturedPieces: []
  };
};

// Find a piece at a specific position
export const getPieceAtPosition = (board: ChessBoard, position: Position): Piece | undefined => {
  return board.pieces.find(piece => 
    piece.position.row === position.row && piece.position.col === position.col
  );
};

// Check if a position is within the board boundaries
export const isPositionWithinBoard = (position: Position): boolean => {
  return position.row >= 0 && position.row < BOARD_SIZE && 
         position.col >= 0 && position.col < BOARD_SIZE;
};

// Check if a position is occupied by a piece of a specific color
export const isPositionOccupiedByColor = (board: ChessBoard, position: Position, color: PieceColor): boolean => {
  const piece = getPieceAtPosition(board, position);
  return piece !== undefined && piece.color === color;
};

// Get all possible moves for a pawn
const getPawnMoves = (board: ChessBoard, piece: Piece): Position[] => {
  const moves: Position[] = [];
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  
  // Forward move
  const forwardPos = { row: piece.position.row + direction, col: piece.position.col };
  if (isPositionWithinBoard(forwardPos) && !getPieceAtPosition(board, forwardPos)) {
    moves.push(forwardPos);
    
    // Double forward move if pawn hasn't moved yet
    if (piece.position.row === startRow) {
      const doubleForwardPos = { row: piece.position.row + (2 * direction), col: piece.position.col };
      if (!getPieceAtPosition(board, doubleForwardPos)) {
        moves.push(doubleForwardPos);
      }
    }
  }
  
  // Diagonal captures
  const captureMoves = [
    { row: piece.position.row + direction, col: piece.position.col - 1 },
    { row: piece.position.row + direction, col: piece.position.col + 1 }
  ];
  
  captureMoves.forEach(pos => {
    if (isPositionWithinBoard(pos)) {
      const targetPiece = getPieceAtPosition(board, pos);
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(pos);
      }
    }
  });
  
  return moves;
};

// Get all possible moves for a rook
const getRookMoves = (board: ChessBoard, piece: Piece): Position[] => {
  const moves: Position[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];
  
  directions.forEach(dir => {
    let currentPos = { ...piece.position };
    
    while (true) {
      currentPos = { row: currentPos.row + dir.row, col: currentPos.col + dir.col };
      
      if (!isPositionWithinBoard(currentPos)) break;
      
      const targetPiece = getPieceAtPosition(board, currentPos);
      if (!targetPiece) {
        moves.push(currentPos);
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push(currentPos);
        }
        break;
      }
    }
  });
  
  return moves;
};

// Get all possible moves for a knight
const getKnightMoves = (board: ChessBoard, piece: Piece): Position[] => {
  const moves: Position[] = [];
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 }
  ];
  
  knightMoves.forEach(move => {
    const targetPos = { 
      row: piece.position.row + move.row, 
      col: piece.position.col + move.col 
    };
    
    if (isPositionWithinBoard(targetPos)) {
      const targetPiece = getPieceAtPosition(board, targetPos);
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(targetPos);
      }
    }
  });
  
  return moves;
};

// Get all possible moves for a bishop
const getBishopMoves = (board: ChessBoard, piece: Piece): Position[] => {
  const moves: Position[] = [];
  const directions = [
    { row: -1, col: -1 }, // up-left
    { row: -1, col: 1 },  // up-right
    { row: 1, col: -1 },  // down-left
    { row: 1, col: 1 }    // down-right
  ];
  
  directions.forEach(dir => {
    let currentPos = { ...piece.position };
    
    while (true) {
      currentPos = { row: currentPos.row + dir.row, col: currentPos.col + dir.col };
      
      if (!isPositionWithinBoard(currentPos)) break;
      
      const targetPiece = getPieceAtPosition(board, currentPos);
      if (!targetPiece) {
        moves.push(currentPos);
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push(currentPos);
        }
        break;
      }
    }
  });
  
  return moves;
};

// Get all possible moves for a queen (combination of rook and bishop)
const getQueenMoves = (board: ChessBoard, piece: Piece): Position[] => {
  return [
    ...getRookMoves(board, piece),
    ...getBishopMoves(board, piece)
  ];
};

// Get all possible moves for a king
const getKingMoves = (board: ChessBoard, piece: Piece): Position[] => {
  const moves: Position[] = [];
  const kingMoves = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
  ];
  
  kingMoves.forEach(move => {
    const targetPos = { 
      row: piece.position.row + move.row, 
      col: piece.position.col + move.col 
    };
    
    if (isPositionWithinBoard(targetPos)) {
      const targetPiece = getPieceAtPosition(board, targetPos);
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(targetPos);
      }
    }
  });
  
  return moves;
};

// Get all valid moves for a specific piece
export const getValidMovesForPiece = (board: ChessBoard, piece: Piece): Position[] => {
  let moves: Position[] = [];
  
  switch (piece.type) {
    case 'pawn':
      moves = getPawnMoves(board, piece);
      break;
    case 'rook':
      moves = getRookMoves(board, piece);
      break;
    case 'knight':
      moves = getKnightMoves(board, piece);
      break;
    case 'bishop':
      moves = getBishopMoves(board, piece);
      break;
    case 'queen':
      moves = getQueenMoves(board, piece);
      break;
    case 'king':
      moves = getKingMoves(board, piece);
      break;
  }
  
  // Filter out moves that would put the king in check
  return moves.filter(move => !wouldMoveResultInCheck(board, piece, move));
};

// Check if a move would result in the king being in check
export const wouldMoveResultInCheck = (board: ChessBoard, piece: Piece, targetPosition: Position): boolean => {
  // Create a temporary board to simulate the move
  const tempBoard: ChessBoard = JSON.parse(JSON.stringify(board));
  const tempPiece = tempBoard.pieces.find(p => 
    p.position.row === piece.position.row && p.position.col === piece.position.col
  );
  
  if (!tempPiece) return false;
  
  // Find and remove the captured piece if any
  const capturedPieceIndex = tempBoard.pieces.findIndex(p => 
    p.position.row === targetPosition.row && p.position.col === targetPosition.col
  );
  
  if (capturedPieceIndex >= 0) {
    tempBoard.pieces.splice(capturedPieceIndex, 1);
  }
  
  // Update the position of the moved piece
  tempPiece.position = { ...targetPosition };
  
  // Find the king of the player who just moved
  const king = tempBoard.pieces.find(p => p.type === 'king' && p.color === piece.color);
  
  if (!king) return false;
  
  // Check if any opponent piece can capture the king
  return tempBoard.pieces.some(p => {
    if (p.color === piece.color) return false;
    
    let opponentMoves: Position[] = [];
    switch (p.type) {
      case 'pawn':
        opponentMoves = getPawnMoves(tempBoard, p);
        break;
      case 'rook':
        opponentMoves = getRookMoves(tempBoard, p);
        break;
      case 'knight':
        opponentMoves = getKnightMoves(tempBoard, p);
        break;
      case 'bishop':
        opponentMoves = getBishopMoves(tempBoard, p);
        break;
      case 'queen':
        opponentMoves = getQueenMoves(tempBoard, p);
        break;
      case 'king':
        opponentMoves = getKingMoves(tempBoard, p);
        break;
    }
    
    return opponentMoves.some(m => m.row === king.position.row && m.col === king.position.col);
  });
};

// Check if the current player is in check
export const isKingInCheck = (board: ChessBoard, color: PieceColor): boolean => {
  // Find the king
  const king = board.pieces.find(p => p.type === 'king' && p.color === color);
  
  if (!king) return false;
  
  // Check if any opponent piece can capture the king
  return board.pieces.some(piece => {
    if (piece.color === color) return false;
    
    const moves = getMovesWithoutCheckFilter(board, piece);
    return moves.some(move => 
      move.row === king.position.row && move.col === king.position.col
    );
  });
};

// Get moves without the check filter for the isKingInCheck function
const getMovesWithoutCheckFilter = (board: ChessBoard, piece: Piece): Position[] => {
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, piece);
    case 'rook':
      return getRookMoves(board, piece);
    case 'knight':
      return getKnightMoves(board, piece);
    case 'bishop':
      return getBishopMoves(board, piece);
    case 'queen':
      return getQueenMoves(board, piece);
    case 'king':
      return getKingMoves(board, piece);
    default:
      return [];
  }
};

// Check if the current player is in checkmate
export const isKingInCheckmate = (board: ChessBoard, color: PieceColor): boolean => {
  // If not in check, can't be in checkmate
  if (!isKingInCheck(board, color)) return false;
  
  // Find all pieces of the current player
  const playerPieces = board.pieces.filter(p => p.color === color);
  
  // Check if any piece can make a move that gets out of check
  return !playerPieces.some(piece => {
    const validMoves = getValidMovesForPiece(board, piece);
    return validMoves.length > 0;
  });
};

// Make a move on the board
export const makeMove = (board: ChessBoard, from: Position, to: Position): ChessBoard => {
  const updatedBoard = JSON.parse(JSON.stringify(board));
  
  // Find the piece to move
  const pieceIndex = updatedBoard.pieces.findIndex(p => 
    p.position.row === from.row && p.position.col === from.col
  );
  
  if (pieceIndex === -1) return updatedBoard;
  
  const piece = updatedBoard.pieces[pieceIndex];
  
  // Find and remove the captured piece if any
  const capturedPieceIndex = updatedBoard.pieces.findIndex(p => 
    p.position.row === to.row && p.position.col === to.col
  );
  
  if (capturedPieceIndex >= 0) {
    updatedBoard.capturedPieces.push(updatedBoard.pieces[capturedPieceIndex]);
    updatedBoard.pieces.splice(capturedPieceIndex, 1);
  }
  
  // Update the position of the moved piece
  piece.position = { ...to };
  piece.hasMoved = true;
  
  // Switch turns
  updatedBoard.currentTurn = updatedBoard.currentTurn === 'white' ? 'black' : 'white';
  
  // Check if the opponent is in check or checkmate
  const opponentColor = piece.color === 'white' ? 'black' : 'white';
  updatedBoard.isCheck = isKingInCheck(updatedBoard, opponentColor);
  
  if (updatedBoard.isCheck) {
    updatedBoard.isCheckmate = isKingInCheckmate(updatedBoard, opponentColor);
  } else {
    updatedBoard.isCheckmate = false;
  }
  
  updatedBoard.selectedPiece = null;
  updatedBoard.validMoves = [];
  
  return updatedBoard;
};

// Convert board position to algebraic notation
export const toAlgebraicNotation = (position: Position): string => {
  const file = String.fromCharCode(97 + position.col); // 'a' through 'h'
  const rank = 8 - position.row; // 1 through 8
  return `${file}${rank}`;
};
