interface LevelType{
    level: number,                   // 第1关
    row: number,                     // 行数
    col: number,                     // 列数
    spaceX: number,                 // 列间隔
    spaceY: number,                 // 行间隔
    brickWidth: number,            // 砖块宽度
    brickHeight: number,           // 砖块高度
    levelState: string,             // 关卡状态
    transparentBricks:number[][]  // 刚开始就透明的砖块

}