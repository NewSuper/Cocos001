import { Piece, PieceColor } from './Piece'

export class GoBand {

	public lastPiece: Piece = null;
	public pieceMap: Piece[][] = null;
	public get Color() { return this.state }

	private Size: number;

	state: PieceColor;

	constructor(Size: number) {
		this.Size = Size;
		this.pieceMap = [];
		this.pieceMap.length = this.Size;
		for (let i = 0; i < this.Size; i++) {
			this.pieceMap[i] = []
			this.pieceMap[i].length = this.Size;
			for (let j = 0; j < this.Size; j++) {
				this.pieceMap[i][j] = new Piece(j, i);
			}
		}
		//黑棋先行
		this.state= PieceColor.white;
	}

	//判断输赢
	public checkWin(): boolean {
		if (!this.lastPiece) {
			cc.log('lastPiece is null');
			return false;
		}
		let dir = [[1, 0], [0, 1], [1, -1], [1, 1]]
		for (let i = 0; i < dir.length; i++) {
			let fiveCount = 1;
			let left = true, right = true;
			for (let j = 1; j <= 5 && (left || right); j++) {
				let mx = this.lastPiece.x + dir[i][0] * j
				let my = this.lastPiece.y + dir[i][1] * j

				if (this.inArea(mx, my) && this.pieceMap[my][mx].color === this.lastPiece.color) {
					fiveCount++;
				}
				else {
					left = false
				}
				mx = this.lastPiece.x - dir[i][0] * j
				my = this.lastPiece.y - dir[i][1] * j

				if (this.inArea(mx, my) && this.pieceMap[my][mx].color === this.lastPiece.color) {
					fiveCount++;
				}
				else {
					right = false
				}
				if (fiveCount >= 5) {
					return true
				}
			}
		}
		return false
	}

	public inArea(x: number, y: number) {
		return x >= 0 && x < this.Size && y >= 0 && y < this.Size
	}

	public place(pos: cc.Vec2): boolean {
		this.lastPiece = this.pieceMap[pos.y][pos.x];
		cc.log(this.lastPiece.color);
		if (this.lastPiece.color != PieceColor.none) {
			return false
		}
		this._changeState()
		this.lastPiece.color=this.Color;
		return true;
	}

	//黑白方切换
	private _changeState() {
		if (this.state == PieceColor.black) {
			this.state = PieceColor.white
		}
		else if (this.state == PieceColor.white) {
			this.state = PieceColor.black
		}
	}
}
