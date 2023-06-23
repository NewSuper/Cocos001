const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null

    score: number = 0;

    isGameStart=false;

    onLoad () {
        this.node.on('add',this.addScore,this);
        
    }

    start() {
        this.scoreLabel.string = this.score.toString();
    }

    addScore(){
        this.score++;
        this.scoreLabel.string = this.score.toString();
    }

    

    // update (dt) {}

    init() {
        // 首先获取当前关卡信息
       //  let currentLevelInfo = JSON.parse(cc.sys.localStorage.getItem('currentLevelInfo'));
       //  this.level = currentLevelInfo['level'];                                           // 第几关
       //  this.row = currentLevelInfo['row'];                                               // 行数
       //  this.col = currentLevelInfo['col'];                                               // 列数
       //  this.spaceX = currentLevelInfo['spaceX'];                                         // 列间隔
       //  this.spaceY = currentLevelInfo['spaceY'];                                         // 行间隔
       //  this.brickWidth = currentLevelInfo['brickWidth'];                                 // 砖块宽度
       //  this.brickHeight = currentLevelInfo['brickHeight'];                               // 砖块高度
       //  this.transparentBricks = currentLevelInfo['transparentBricks'];                   // 刚开始就透明的砖块
       //  this.speed = 20;                                                                  // bar移动速度

   }

   updateInfo(){
    let settings = JSON.parse(cc.sys.localStorage.getItem('settings'));
    //settings[this.level-1]['levelState'] = 'PASSED';        // 当前关卡状态变为通过(数组下标-1)
    //settings[this.level]['levelState'] = 'UNLOCKED';        // 下一关卡状态变为解锁
    cc.sys.localStorage.setItem('settings', JSON.stringify(settings));
}
}
