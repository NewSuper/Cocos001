export let settings = [
    {                               
        level: 1,                   // 第1关
        row: 3,                     // 行数
        col: 3,                     // 列数
        spaceX: 20,                 // 列间隔
        spaceY: 20,                 // 行间隔
        brickWidth: 200,            // 砖块宽度
        brickHeight: 100,           // 砖块高度
        levelState: 'UNLOCKED',     // 关卡状态
        transparentBricks: [[1,0], [2,2]]  // 刚开始就透明的砖块
    },

    {   
        level: 2,                   // 第2关
        row: 6,
        col: 6,
        spaceX: 10,
        spaceY: 10,
        brickWidth: 120,
        brickHeight: 70,
        levelState: 'LOCKED',
        transparentBricks: [[3,5], [4,1], [3,4]]
    },

    {                               
        level: 3,                   // 第3关
        row: 9,
        col: 9,
        spaceX: 10,
        spaceY: 10,
        brickWidth: 100,
        brickHeight: 50,
        levelState: 'LOCKED',
        transparentBricks: [[7,5], [3,1], [5,7],[7,2],[6,8],[7,7]]
    },

    {                               
        level: 4,                   // 第4关
        row: 12,
        col: 15,
        spaceX: 5,
        spaceY: 5,
        brickWidth: 80,
        brickHeight: 40,
        levelState: 'LOCKED',
        transparentBricks: [[1,1], [2,2], [3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9]]
    },

    {                               
        level: 5,                   // 第5关
        row: 12,
        col: 15,
        spaceX: 5,
        spaceY: 5,
        brickWidth: 80,
        brickHeight: 40,
        levelState: 'LOCKED',
        transparentBricks: [[1,1], [2,2], [3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9]]
    },

    {                               
        level: 6,                   // 第6关
        row: 13,
        col: 13,
        spaceX: 4,
        spaceY: 4,
        brickWidth: 60,
        brickHeight: 30,
        levelState: 'LOCKED',
        transparentBricks: [[9,9], [1,1], [3,4],[5,4],[5,6],[7,6],[7,8],[8,10],[9,1]]
    },
]
