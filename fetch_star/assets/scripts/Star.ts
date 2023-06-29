import GameManager from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property
    pickRadius:number=0

    game:GameManager=null;

    reuse(game:GameManager){
        this.game=game;
        this.enabled=true;
        this.node.opacity=255;
    }

    getPlayerDistance () {
        // 根据 player 节点位置判断距离
        let playerPos = this.game.player.position;
        // 根据两点位置计算两点之间距离
        let dist = this.node.position.sub(playerPos).mag();
        return dist;
    }

    onPicked(){
        let pos = this.node.position;
        // 调用 Game 脚本的得分方法
        this.game.gainScore(pos);
        // 然后销毁当前星星节点
        this.game.despawnStar(this.node);
    }

    // onLoad () {}

    start () {

    }

    update (dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }
        
        // 根据 Game 脚本中的计时器更新星星的透明度
        let opacityRatio = 1 - this.game.timer/this.game.starDuration;
        let minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
}
