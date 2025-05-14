
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
