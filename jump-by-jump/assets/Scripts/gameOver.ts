
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    maxScoreLabel: cc.Label = null;

    @property(cc.Node)
    newSocre: cc.Node = null;


    score: number = 0;
    maxScore: number = 0;

    onLoad() {
        this.maxScore = cc.sys.localStorage.getItem('maxScore');
        if (this.maxScore == null) {
            this.maxScore = 0;
        }
        this.node.on('setScore', this.setScore, this);
    }


    setScore(score: number) {
        this.score = score;
        this.scoreLabel.string = this.score + '';

        if (this.score > this.maxScore) {
            this.maxScore = this.score;
            this.newSocre.active = true;
            cc.sys.localStorage.setItem('maxScore', this.maxScore);
        }
        this.maxScoreLabel.string = 'max Score:' + this.maxScore;
    }

    start() {

    }

    // update (dt) {}

    playrtAgian() {
        cc.director.loadScene('game');
    }

    backToHome() {
        cc.director.loadScene('start');
    }
}
