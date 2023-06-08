const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    labelScore: cc.Label = null;

    @property(cc.Node)
    gameoverNode: cc.Node = null;

    @property(cc.Node)
    healthBar: cc.Node = null;

    @property(cc.Animation)
    light: cc.Animation = null

    @property(cc.AudioClip)
    boomAudio: cc.AudioClip = null

    @property(cc.AudioClip)
    overAudio: cc.AudioClip = null

    score: number = 0;

    dropTimes = 0;        //掉落次数

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('addScore', this.addScore, this);
        this.node.on('onDrop', this.onDrop, this);
        this.node.on('boomLight', this.boomLight, this);
    }

    start() {

    }

    // update (dt) {}

    addScore() {
        this.score++;
        this.labelScore.string = this.score.toString();
    }

    onDrop() {
        let x = this.healthBar.children[this.dropTimes];
        x.children[0].active=true;

        this.dropTimes++;
        if (this.dropTimes >= 3) {
            cc.audioEngine.playEffect(this.overAudio, false);
            this.gameover();
        }
    }

    boomLight() {
        this.light.play();
        cc.audioEngine.playEffect(this.boomAudio, false);
        this.scheduleOnce(this.gameover, 2);
    }

    gameover() {
        this.gameoverNode.active = true;
        this.scheduleOnce(() => {
            cc.director.loadScene('start');
        }, 3);

    }
}
