
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    topScore: cc.Label = null;

    @property(cc.Label)
    currentScore: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //读取最高分和这次的得分
        let _topScore = cc.sys.localStorage.getItem('topScore');
        this.topScore.string = _topScore;
        //当前成绩
        let _currentScore = cc.sys.localStorage.getItem('currentScore');
        this.currentScore.string = _currentScore;

        if(_topScore<_currentScore){
            cc.sys.localStorage.setItem('topScore',_currentScore);
        }
        //历史得分
        //cc.director.preloadScene('historyScore');

    }

    start() {

    }

    // update (dt) {}

    //重新开始
    gameRestart() {
        cc.director.loadScene('game');
        //cc.director.resume();
    }

    // 退出游戏
    gameExit() {
        cc.director.loadScene('start');
    }
    //历史得分
    gotoHistoryScore() {
        //cc.director.loadScene('historyScore');
    }
}
