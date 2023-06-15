import LetterCtrl from "./LetterCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LettersRootCtrl extends cc.Component {

    @property({type:cc.Prefab, tooltip:"生成字母的预制体"})
    letterPrefab: cc.Prefab = null;

    @property({type:cc.Float, tooltip:"生成字母的最短时间间隔"})
    minInterval: number = 1;

    @property({type:cc.Float, tooltip:"生成字母的最长时间间隔"})
    maxInterval: number = 3;

    @property({type:cc.Label, tooltip:"得分显示组件"})
    scoreLabel: cc.Label = null;

    private countKeyPress : number = 0;
    private rate : number = 0.8;
    private levelScore : number = 10;


    private score : number = 0;     // 得分
    private actualInterval : number = 1;
    private intervalLen : number = 1;
    private passedTime : number = 0;
    public isRun : boolean = false;      // 游戏运行中
    private idxs : Array<number> = [];  // 所有索引，用于移入和移出

    public imgs : Array<cc.SpriteFrame> = [];
    onLoad () {
        let self : any = this;
        cc.loader.loadResDir("letters", cc.SpriteFrame, function(err, spfs){
            self.imgs = spfs;
            console.log("imgs:", self.imgs);
            for(let i=0; i<self.imgs.length; i++){
                self.idxs.push(i);
            }
            self.isRun = true;          // 加载完后再启动游戏
        });
        self.addListeners();
    }

    private addListeners(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(e){
        let allLettersNode : Array<cc.Node> = this.node.children;
        for(let i=allLettersNode.length-1; i>=0; i--){
            if(allLettersNode[i].getComponent(LetterCtrl).info.charCodeAt() == e.keyCode){
                this.idxs.push(allLettersNode[i].getComponent(LetterCtrl).index);
                allLettersNode[i].destroy();
                this.scoreLabel.string = "" + (++this.score);
                console.log("score:", this.score, this.scoreLabel.string);
                break;
            }
        }
        this.countKeyPress++;
        if(this.score >= this.levelScore && this.score/this.countKeyPress >= this.rate){
            console.log("恭喜进入下一关");
        }else if(this.score >= this.levelScore && this.score/this.countKeyPress < this.rate){
            console.log("很遗憾，挑战失败！");
        }
    }

    start () {
        this.intervalLen = this.maxInterval - this.minInterval;
        this.actualInterval = Math.random()*this.intervalLen + this.minInterval;
        this.passedTime = this.actualInterval;
    }

    update (dt) {
        if(this.isRun === false){
            return;
        }

        this.passedTime += dt;
        if(this.passedTime >= this.actualInterval){
            let letterNode : cc.Node = cc.instantiate(this.letterPrefab);
            
            letterNode.parent = this.node;

            let xLen : number = this.node.width - letterNode.width;
            letterNode.x = Math.random()*xLen -xLen/2;

            let index : number = Math.floor(Math.random()*this.idxs.length);
            index = this.idxs.splice(index, 1)[0];
            if(index == undefined){
                index = 0;
            }

            letterNode.getComponent(LetterCtrl).index = index;
            letterNode.getComponent(LetterCtrl).info = this.imgs[index].name;

            letterNode.getComponent(cc.Sprite).spriteFrame = this.imgs[index];

            this.passedTime = 0;
            this.actualInterval = Math.random()*this.intervalLen + this.minInterval;

            let allLettersNode : Array<cc.Node> = this.node.children;
            for(let i=allLettersNode.length-1; i>=0; i--){
                if(allLettersNode[i].y < -this.node.height){
                    this.idxs.push(allLettersNode[i].getComponent(LetterCtrl).index);
                    allLettersNode[i].destroy();
                }
            }
        }
    }
}
