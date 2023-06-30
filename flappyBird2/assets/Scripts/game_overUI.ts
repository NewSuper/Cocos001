
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    bestLabel: cc.Label = null;

    @property(cc.Node)
    isNew:cc.Node=null

    onLoad () {
        this.node.on('setScore',this.setScore,this);
    }

    start () {

    }

    setScore(score:number){
        this.scoreLabel.string=score.toString();
        let best:number=cc.sys.localStorage.getItem('best');
        if(best==null){
            best=0;
        }
        //如果当前的分数大于最高分
        if(score>best){
            cc.sys.localStorage.setItem('best',score);
            this.isNew.active=true;
            best=score;
        }
        this.bestLabel.string=best.toString();
    }

    // update (dt) {}
}
