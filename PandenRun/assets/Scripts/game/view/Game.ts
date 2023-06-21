import { Data } from "../model/Data";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    gameOver: cc.Node = null;

    @property(cc.Label)
    glodNumber: cc.Label = null

    @property(cc.Label)
    moveNumber: cc.Label = null

    @property(cc.Label)
    allNumber: cc.Label = null

    @property(cc.Label)
    glodLabel: cc.Label = null;

    glod: number = 0;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('addScore', this.addScore, this);
        this.node.on('gameover', this.gameover, this);
    }

    start() {

    }

    move: number = 0;
    update(dt) {
        this.move += Data.speed * dt;
    }

    addScore() {
        this.glod++;
        this.glodLabel.string = this.glod.toString();
    }

    gameover() {
        this.gameOver.active = true;
        this.glodNumber.string = (this.glod | 0).toString();
        this.moveNumber.string = (this.move | 0).toString();
        this.allNumber.string = (this.glod * 100 + this.move | 0) + '';
    }
    resetGame() {
        cc.director.loadScene('game');
    }
}
