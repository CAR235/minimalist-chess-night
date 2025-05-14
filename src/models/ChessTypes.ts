
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';
export type Position = { row: number; col: number };

export interface Piece {
  type: PieceType;
  color: PieceColor;
  position: Position;
  hasMoved?: boolean;
}

export interface ChessBoard {
  pieces: Piece[];
  selectedPiece: Piece | null;
  validMoves: Position[];
  currentTurn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  capturedPieces: Piece[];
  moveHistory: Move[];
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece;
  isPromotion?: boolean;
  isEnPassant?: boolean;
  isCastling?: boolean;
}

// Serialization helper for converting ChessBoard to a JSON-compatible format
export const serializeChessBoard = (board: ChessBoard): any => {
  return {
    ...board,
    selectedPiece: board.selectedPiece ? { ...board.selectedPiece } : null,
    validMoves: [...board.validMoves],
    capturedPieces: [...board.capturedPieces],
    moveHistory: board.moveHistory.map(move => ({
      ...move,
      piece: { ...move.piece },
      capturedPiece: move.capturedPiece ? { ...move.capturedPiece } : undefined
    }))
  };
};

// Deserialization helper for converting JSON data back to ChessBoard
export const deserializeChessBoard = (data: any): ChessBoard => {
  return {
    pieces: data.pieces || [],
    selectedPiece: data.selectedPiece,
    validMoves: data.validMoves || [],
    currentTurn: data.currentTurn || 'white',
    isCheck: Boolean(data.isCheck),
    isCheckmate: Boolean(data.isCheckmate),
    capturedPieces: data.capturedPieces || [],
    moveHistory: data.moveHistory || []
  };
};
