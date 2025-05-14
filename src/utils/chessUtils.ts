import { ChessBoard, Piece, PieceColor, PieceType, Position } from '../models/ChessTypes';

const initialPieces = (): Piece[] => [
  { type: 'rook', color: 'white', position: { row: 7, col: 0 } },
  { type: 'knight', color: 'white', position: { row: 7, col: 1 } },
  { type: 'bishop', color: 'white', position: { row: 7, col: 2 } },
  { type: 'queen', color: 'white', position: { row: 7, col: 3 } },
  { type: 'king', color: 'white', position: { row: 7, col: 4 } },
  { type: 'bishop', color: 'white', position: { row: 7, col: 5 } },
  { type: 'knight', color: 'white', position: { row: 7, col: 6 } },
  { type: 'rook', color: 'white', position: { row: 7, col: 7 } },
  { type: 'pawn', color: 'white', position: { row: 6, col: 0 } },
  { type: 'pawn', color: 'white', position: { row: 6, col: 1 } },
  { type: 'pawn', color: 'white', position: { row: 6, col: 2 } },
  { type: 'pawn', color: 'white', position: { row: 6, col: 3 } },
  { type: 'pawn', color: 'white', position: { row: 6, col: 4 } },
  { type: 'pawn', color: 'white', position: { row: 6, col: 5 } },
  { type: 'pawn', color: 'white', position: { row: 6, col: 6 } },
  { type: 'pawn', color: 'white', position: { row: 6, col: 7 } },

  { type: 'rook', color: 'black', position: { row: 0, col: 0 } },
  { type: 'knight', color: 'black', position: { row: 0, col: 1 } },
  { type: 'bishop', color: 'black', position: { row: 0, col: 2 } },
  { type: 'queen', color: 'black', position: { row: 0, col: 3 } },
  { type: 'king', color: 'black', position: { row: 0, col: 4 } },
  { type: 'bishop', color: 'black', position: { row: 0, col: 5 } },
  { type: 'knight', color: 'black', position: { row: 0, col: 6 } },
  { type: 'rook', color: 'black', position: { row: 0, col: 7 } },
  { type: 'pawn', color: 'black', position: { row: 1, col: 0 } },
  { type: 'pawn', color: 'black', position: { row: 1, col: 1 } },
  { type: 'pawn', color: 'black', position: { row: 1, col: 2 } },
  { type: 'pawn', color: 'black', position: { row: 1, col: 3 } },
  { type: 'pawn', color: 'black', position: { row: 1, col: 4 } },
  { type: 'pawn', color: 'black', position: { row: 1, col: 5 } },
  { type: 'pawn', color: 'black', position: { row: 1, col: 6 } },
  { type: 'pawn', color: 'black', position: { row: 1, col: 7 } },
];

export const initializeBoard = (): ChessBoard => {
  const pieces = [...initialPieces()];
  return {
    pieces,
    selectedPiece: null,
    validMoves: [],
    currentTurn: 'white',
    isCheck: false,
    isCheckmate: false,
    capturedPieces: [],
    moveHistory: [],
  };
};

export const getPieceAtPosition = (board: ChessBoard, position: Position): Piece | undefined => {
  return board.pieces.find(p => p.position.row === position.row && p.position.col === position.col);
};

export const isValidPosition = (position: Position): boolean => {
  return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
};

export const getValidMovesForPiece = (board: ChessBoard, piece: Piece): Position[] => {
  switch (piece.type) {
    case 'pawn':
      return getValidMovesForPawn(board, piece);
    case 'rook':
      return getValidMovesForRook(board, piece);
    case 'knight':
      return getValidMovesForKnight(board, piece);
    case 'bishop':
      return getValidMovesForBishop(board, piece);
    case 'queen':
      return getValidMovesForQueen(board, piece);
    case 'king':
      return getValidMovesForKing(board, piece);
    default:
      return [];
  }
};

const getValidMovesForPawn = (board: ChessBoard, piece: Piece): Position[] => {
  const { row, col } = piece.position;
  const direction = piece.color === 'white' ? -1 : 1;
  const validMoves: Position[] = [];

  // One square forward
  const oneSquareForward: Position = { row: row + direction, col };
  if (isValidPosition(oneSquareForward) && !getPieceAtPosition(board, oneSquareForward)) {
    validMoves.push(oneSquareForward);

    // Two squares forward on first move
    if (!piece.hasMoved) {
      const twoSquaresForward: Position = { row: row + 2 * direction, col };
      if (isValidPosition(twoSquaresForward) && !getPieceAtPosition(board, twoSquaresForward) && !getPieceAtPosition(board, oneSquareForward)) {
        validMoves.push(twoSquaresForward);
      }
    }
  }

  // Captures
  const capturePositions: Position[] = [
    { row: row + direction, col: col + 1 },
    { row: row + direction, col: col - 1 }
  ];

  capturePositions.forEach(capturePosition => {
    if (isValidPosition(capturePosition)) {
      const pieceAtCapturePosition = getPieceAtPosition(board, capturePosition);
      if (pieceAtCapturePosition && pieceAtCapturePosition.color !== piece.color) {
        validMoves.push(capturePosition);
      }
    }
  });

  return validMoves;
};

const getValidMovesForRook = (board: ChessBoard, piece: Piece): Position[] => {
  return getValidMovesForStraightLinePiece(board, piece, 1);
};

const getValidMovesForBishop = (board: ChessBoard, piece: Piece): Position[] => {
  return getValidMovesForDiagonalPiece(board, piece, 1);
};

const getValidMovesForQueen = (board: ChessBoard, piece: Piece): Position[] => {
  return [
    ...getValidMovesForStraightLinePiece(board, piece, 1),
    ...getValidMovesForDiagonalPiece(board, piece, 1)
  ];
};

const getValidMovesForKnight = (board: ChessBoard, piece: Piece): Position[] => {
  const { row, col } = piece.position;
  const validMoves: Position[] = [];

  const possibleMoves: Position[] = [
    { row: row + 2, col: col + 1 },
    { row: row + 2, col: col - 1 },
    { row: row - 2, col: col + 1 },
    { row: row - 2, col: col - 1 },
    { row: row + 1, col: col + 2 },
    { row: row + 1, col: col - 2 },
    { row: row - 1, col: col + 2 },
    { row: row - 1, col: col - 2 }
  ];

  possibleMoves.forEach(move => {
    if (isValidPosition(move)) {
      const pieceAtPosition = getPieceAtPosition(board, move);
      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        validMoves.push(move);
      }
    }
  });

  return validMoves;
};

const getValidMovesForKing = (board: ChessBoard, piece: Piece): Position[] => {
  const { row, col } = piece.position;
  const validMoves: Position[] = [];

  const possibleMoves: Position[] = [
    { row: row + 1, col },
    { row: row - 1, col },
    { row, col: col + 1 },
    { row, col: col - 1 },
    { row: row + 1, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row - 1, col: col + 1 },
    { row: row - 1, col: col - 1 }
  ];

  possibleMoves.forEach(move => {
    if (isValidPosition(move)) {
      const pieceAtPosition = getPieceAtPosition(board, move);
      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        validMoves.push(move);
      }
    }
  });

  return validMoves;
};

const getValidMovesForStraightLinePiece = (board: ChessBoard, piece: Piece, distance: number): Position[] => {
  const { row, col } = piece.position;
  const validMoves: Position[] = [];

  // Directions: up, down, left, right
  const directions = [
    { row: -1, col: 0 },  // Up
    { row: 1, col: 0 },   // Down
    { row: 0, col: -1 },  // Left
    { row: 0, col: 1 }   // Right
  ];

  directions.forEach(direction => {
    for (let i = 1; i <= 7; i++) {
      const newPosition: Position = { row: row + i * direction.row, col: col + i * direction.col };
      if (!isValidPosition(newPosition)) break;

      const pieceAtPosition = getPieceAtPosition(board, newPosition);
      if (!pieceAtPosition) {
        validMoves.push(newPosition);
      } else {
        if (pieceAtPosition.color !== piece.color) {
          validMoves.push(newPosition);
        }
        break;
      }
    }
  });

  return validMoves;
};

const getValidMovesForDiagonalPiece = (board: ChessBoard, piece: Piece, distance: number): Position[] => {
  const { row, col } = piece.position;
  const validMoves: Position[] = [];

  // Directions: up-left, up-right, down-left, down-right
  const directions = [
    { row: -1, col: -1 }, // Up-left
    { row: -1, col: 1 },  // Up-right
    { row: 1, col: -1 },  // Down-left
    { row: 1, col: 1 }   // Down-right
  ];

  directions.forEach(direction => {
    for (let i = 1; i <= 7; i++) {
      const newPosition: Position = { row: row + i * direction.row, col: col + i * direction.col };
      if (!isValidPosition(newPosition)) break;

      const pieceAtPosition = getPieceAtPosition(board, newPosition);
      if (!pieceAtPosition) {
        validMoves.push(newPosition);
      } else {
        if (pieceAtPosition.color !== piece.color) {
          validMoves.push(newPosition);
        }
        break;
      }
    }
  });

  return validMoves;
};

const isKingInCheck = (board: ChessBoard, kingColor: PieceColor): boolean => {
  const king = board.pieces.find(piece => piece.type === 'king' && piece.color === kingColor);

  if (!king) {
    return false;
  }

  // Check if any opponent piece can attack the king
  for (const piece of board.pieces) {
    if (piece.color !== kingColor) {
      const validMoves = getValidMovesForPiece(board, piece);
      if (validMoves.some(move => move.row === king.position.row && move.col === king.position.col)) {
        return true;
      }
    }
  }

  return false;
};

const isCheckmate = (board: ChessBoard, kingColor: PieceColor): boolean => {
  const king = board.pieces.find(piece => piece.type === 'king' && piece.color === kingColor);

  if (!king) {
    return false;
  }

  // 1. Check if the king is currently in check
  if (!isKingInCheck(board, kingColor)) {
    return false;
  }

  // 2. Check if the king has any legal moves to escape check
  const kingMoves = getValidMovesForKing(board, king);
  for (const move of kingMoves) {
    const tempBoard = makeMove(board, king.position, move);
    if (!isKingInCheck(tempBoard, kingColor)) {
      return false;
    }
  }

  // 3. Check if any other piece can block the check or capture the attacking piece
  for (const piece of board.pieces) {
    if (piece.color === kingColor && piece.type !== 'king') {
      const validMoves = getValidMovesForPiece(board, piece);
      for (const move of validMoves) {
        const tempBoard = makeMove(board, piece.position, move);
        if (!isKingInCheck(tempBoard, kingColor)) {
          return false;
        }
      }
    }
  }

  return true;
};

export const makeMove = (
  board: ChessBoard,
  fromPosition: Position,
  toPosition: Position
): ChessBoard => {
  // If the 'from' position is the same as the 'to' position, return the board without changes
  if (fromPosition.row === toPosition.row && fromPosition.col === toPosition.col) {
    return board;
  }
  
  // Create a copy of the board's pieces
  const newPieces = [...board.pieces];
  
  // Find the piece that's moving
  const pieceIndex = newPieces.findIndex(
    p => p.position.row === fromPosition.row && p.position.col === fromPosition.col
  );
  
  if (pieceIndex === -1) {
    return board; // No piece found at the starting position
  }
  
  const piece = { ...newPieces[pieceIndex] };
  
  // Check if there's a capture
  const capturedPieceIndex = newPieces.findIndex(
    p => p.position.row === toPosition.row && p.position.col === toPosition.col
  );
  
  let capturedPiece: Piece | undefined;
  let newCapturedPieces = [...board.capturedPieces];
  
  if (capturedPieceIndex !== -1) {
    capturedPiece = { ...newPieces[capturedPieceIndex] };
    newCapturedPieces.push(capturedPiece);
    newPieces.splice(capturedPieceIndex, 1); // Remove the captured piece
  }
  
  // Special move handling for castling
  const isCastling = piece.type === 'king' && Math.abs(fromPosition.col - toPosition.col) > 1;
  
  if (isCastling) {
    // Determine which rook to move
    const isKingsideCastle = toPosition.col > fromPosition.col;
    const rookCol = isKingsideCastle ? 7 : 0;
    const newRookCol = isKingsideCastle ? 5 : 3;
    
    const rookIndex = newPieces.findIndex(
      p => p.type === 'rook' && 
           p.color === piece.color && 
           p.position.row === fromPosition.row && 
           p.position.col === rookCol
    );
    
    if (rookIndex !== -1) {
      // Move the rook
      newPieces[rookIndex] = {
        ...newPieces[rookIndex],
        position: { row: fromPosition.row, col: newRookCol },
        hasMoved: true
      };
    }
  }
  
  // Update the piece's position
  newPieces[pieceIndex] = {
    ...piece,
    position: toPosition,
    hasMoved: true
  };
  
  // Create new board state
  const newTurn = board.currentTurn === 'white' ? 'black' : 'white';
  const newBoard = {
    pieces: newPieces,
    selectedPiece: null,
    validMoves: [],
    currentTurn: newTurn,
    isCheck: false, // Will be updated
    isCheckmate: false, // Will be updated
    capturedPieces: newCapturedPieces,
    moveHistory: [
      ...board.moveHistory,
      {
        from: fromPosition,
        to: toPosition,
        piece: piece,
        capturedPiece,
        isCastling,
      }
    ]
  };
  
  // Check if the opponent is in check or checkmate after this move
  const isOpponentKingInCheck = isKingInCheck(newBoard, newTurn);
  newBoard.isCheck = isOpponentKingInCheck;
  
  if (isOpponentKingInCheck) {
    // Check if it's checkmate
    newBoard.isCheckmate = isCheckmate(newBoard, newTurn);
  }
  
  return newBoard;
};

export const toAlgebraicNotation = (move: { from: Position; to: Position }): string => {
  const startFile = String.fromCharCode('a'.charCodeAt(0) + move.from.col);
  const startRank = (8 - move.from.row).toString();
  const endFile = String.fromCharCode('a'.charCodeAt(0) + move.to.col);
  const endRank = (8 - move.to.row).toString();

  return startFile + startRank + ' - ' + endFile + endRank;
};
