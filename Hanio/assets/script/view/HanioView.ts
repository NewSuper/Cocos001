import GameDate from "../controller/Game";
import HanioModel from "../model/HaniuModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HanioView extends cc.Component {

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property(cc.Node)
    blockLayer: cc.Node = null;

    @property(cc.AudioClip)
    BGM: cc.AudioClip = null

    @property(cc.AudioClip)
    hit: cc.AudioClip = null

    @property(cc.AudioClip)
    winGame: cc.AudioClip = null

    @property(cc.Node)
    winGameNode:cc.Node=null

    //关卡层数
    level: number=3;    

    hanioModel:HanioModel=null


    onLoad () {
        this.level=GameDate.Instance.level;
        this.hanioModel = new HanioModel(this.level);
    }

    start() {
        this.initBlock(this.level);
    }

    // update (dt) {}

    //生成砖块
    initBlock(n: number) {
        for (let i = 0; i < n; i++) {
            let blockNode = cc.instantiate(this.blockPrefab);
            blockNode.x = this.node.children[0].x;
            blockNode.y = this.getY(i);
            blockNode.parent = this.blockLayer;
            let wid = blockNode.width;
            blockNode.width = wid * (n - i);                  //设置砖块宽度
            blockNode.emit('init', i);
            blockNode.emit('setNode',this.node);
            this.hanioModel.countList[0].push(blockNode.width);
        }
    }

    getY(index: number) {
        return -275 + this.blockPrefab.data.width * index;
    }

    //通过坐标返回当前点击的位置 ,-1表示没有点击任何塔
    checkBlock(pos:cc.Vec3):number{
        for(let i=0;i<this.node.children.length;i++){
            let child=this.node.children[i];
            if(child.getBoundingBox().contains(cc.v2(pos))){
                return i;
            }
        }
        return -1;
    }

    //移动砖块
    placeBlock(start:cc.Vec3,node:cc.Node):boolean{
        //旧的位置
        let old=this.checkBlock(start);
        //新的位置
        let index=this.checkBlock(node.position);
        //两个位置必须有效
        if(old==-1 || index==-1){
            return false;
        }
        if(!this.hanioModel.place(old,index)){
            return false;
        }
        node.x=this.node.children[index].x;
        node.y=this.getY(this.hanioModel.countList[index].length-1);
        cc.audioEngine.play(this.hit,false,1);

        if(this.hanioModel.isWinGame()){
            this.winGameNode.active=true;
            cc.audioEngine.play(this.winGame,false,1);
            this.scheduleOnce(()=>{
                GameDate.Instance.level++;
                cc.game.restart();
                // cc.director.runScene(cc.director.getScene());
            },1);
        }
        return true;
    }
}
