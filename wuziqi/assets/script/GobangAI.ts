import { Piece, PieceColor } from './Piece'

export class GobangAI {
  private fiveGroup: cc.Vec2[][] = [];
  private fiveGroupScore: Array<number> = []//五元组分数

  constructor(private pieceMap: Piece[][]) {
    //添加五元数组
    //横向
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 11; x++) {
        this.fiveGroup.push([
          cc.v2(x, y),
          cc.v2(x + 1, y),
          cc.v2(x + 2, y),
          cc.v2(x + 3, y),
          cc.v2(x + 4, y)]);
      }
    }
    //纵向
    for (let x = 0; x < 15; x++) {
      for (let y = 0; y < 11; y++) {
        this.fiveGroup.push([
          cc.v2(x, y),
          cc.v2(x, y + 1),
          cc.v2(x, y + 2),
          cc.v2(x, y + 3),
          cc.v2(x, y + 4)]);
      }
    }
    //右上斜向
    for (let b = -10; b <= 10; b++) {
      for (let x = 0; x < 11; x++) {
        if (b + x < 0 || b + x > 10) {
          continue;
        } else {
          this.fiveGroup.push([
            cc.v2(x, b + x),
            cc.v2(x + 1, b + x + 1),
            cc.v2(x + 2, b + x + 2),
            cc.v2(x + 3, b + x + 3),
            cc.v2(x + 4, b + x + 4)]);
        }
      }
    }
    //右下斜向
    for (let b = 4; b <= 24; b++) {
      for (let y = 0; y < 11; y++) {
        if (b - y < 4 || b - y > 14) {
          continue;
        } else {
          this.fiveGroup.push([
            cc.v2(b - y, y),
            cc.v2(b - y - 1, y + 1),
            cc.v2(b - y - 2, y + 2),
            cc.v2(b - y - 3, y + 3),
            cc.v2(b - y - 4, y + 4)]);
        }
      }
    }
  }

  getNextPoint():cc.Vec2 {
    //评分
    for (let i = 0; i < this.fiveGroup.length; i++) {
      let b = 0;//五元组里黑棋的个数
      let w = 0;//五元组里白棋的个数
      for (let j = 0; j < 5; j++) {
        let group = this.fiveGroup[i][j];
        if (this.pieceMap[group.y][group.x].color === PieceColor.black) {
          b++;
        } 
        else if (this.pieceMap[group.y][group.x].color === PieceColor.white) {
          w++;
        }
      }
      if (b + w == 0) {
        this.fiveGroupScore[i] = 7;
      } else if (b > 0 && w > 0) {
        this.fiveGroupScore[i] = 0;
      } else if (b == 0 && w == 1) {
        this.fiveGroupScore[i] = 35;
      } else if (b == 0 && w == 2) {
        this.fiveGroupScore[i] = 800;
      } else if (b == 0 && w == 3) {
        this.fiveGroupScore[i] = 15000;
      } else if (b == 0 && w == 4) {
        this.fiveGroupScore[i] = 800000;
      } else if (w == 0 && b == 1) {
        this.fiveGroupScore[i] = 15;
      } else if (w == 0 && b == 2) {
        this.fiveGroupScore[i] = 400;
      } else if (w == 0 && b == 3) {
        this.fiveGroupScore[i] = 1800;
      } else if (w == 0 && b == 4) {
        this.fiveGroupScore[i] = 100000;
      }
    }
    //找最高分的五元组
    let hScore = 0;
    let mPosition = 0;
    for (let i = 0; i < this.fiveGroupScore.length; i++) {
      if (this.fiveGroupScore[i] > hScore) {
        hScore = this.fiveGroupScore[i];
        mPosition = i;
      }
    }
    //在最高分的五元组里找到最优下子位置
    let flag1 = false;//无子
    let flag2 = false;//有子
    let nPosition = 0;

    for (let i = 0; i < 5; i++) {
      let board=this.fiveGroup[mPosition][i]
      if (!flag1 && this.pieceMap[board.y][board.x].color === PieceColor.none) {
        nPosition = i;
      }
      if (!flag2 && this.pieceMap[board.y][board.x].color !== PieceColor.none) {
        flag1 = true;
        flag2 = true;
      }
      if (flag2 && this.pieceMap[board.y][board.x].color === PieceColor.none) {
        nPosition = i;
        break;
      }
    }
    //在最最优位置下子
    return this.fiveGroup[mPosition][nPosition];
  }
}