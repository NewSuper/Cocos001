import { Global } from '../model/global'
const { ccclass, property } = cc._decorator;



@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    play: cc.Node = null;

    @property(cc.Node)
    bulletGroup: cc.Node = null

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    bombLabel: cc.Label = null


    onLoad() {
        let manager = cc.director.getCollisionManager();
        //默认碰撞检测系统是禁用的
        manager.enabled = true;
        //默认碰撞检测系统的 debug 绘制是禁用的
        //manager.enabledDebugDraw = true;
        //显示碰撞包围盒
        //manager.enabledDrawBoundingBox = true;
    }

    start() {

    }

    update(dt) {
        if (this.scoreLabel) {
            this.scoreLabel.string = Global.score.toString();
        }
        if (this.bombLabel){
            this.bombLabel.string = Global.bombSize.toString();
        }
            
    }
}
