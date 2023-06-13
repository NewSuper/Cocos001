export enum PieceColor {
  none,
  black,
  white,
}

export class Piece {
  constructor(public x: number, public y: number, public color: number = PieceColor.none) { }
}