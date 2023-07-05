
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    blockLayer: cc.Node = null;

    @property(cc.Node)
    gameNode:cc.Node=null

    @property(cc.Vec3)
    startPos: cc.Vec3 = cc.v3(-180, -300);

    @property(cc.Label)
    scoreLabel:cc.Label=null

    @property(cc.Node)
    gameOverNode:cc.Node=null


    currentBlock: cc.Node = null           //当前方块
    nextBlock: cc.Node = null              //下一个方块

    score:number=0;

    onLoad () {
        this.node.on('addScore',this.addScore,this);
        this.node.on('moveMap',this.moveMap,this);
        this.node.on('gameOver',this.gameOver,this);
    }

    start() {
        this.onGameStart();
    }

    onGameStart() {
        this.blockLayer.removeAllChildren();

        this.currentBlock = this.spawnBlock();
        this.nextBlock = this.currentBlock;
        this.currentBlock.position = this.startPos;

        this.setPlayerPos();
        this.addNextBlock();
    }

    // update (dt) {}

    //设置玩家的坐标位置
    setPlayerPos() {
        let w_pos = this.currentBlock.getChildByName('mid').position;
        w_pos=this.currentBlock.convertToWorldSpaceAR(w_pos);
        this.player.position=this.blockLayer.convertToNodeSpaceAR(w_pos);
    }

    //生成方块
    spawnBlock() {
        let block = cc.instantiate(this.blockPrefab);
        this.blockLayer.addChild(block);
        return block;
    }

    //添加下一个方块
    addNextBlock(){
        this.currentBlock=this.nextBlock;
        this.nextBlock=this.spawnBlock();
        let x=200+Math.random()*200;
        let y=x*0.556;
        let nextPos=this.currentBlock.position;

        let direction=this.player.getComponent('player').direction;
        nextPos.x+=x*direction;
        nextPos.y+=y;
        this.nextBlock.position=nextPos;
        this.player.emit('setNextBlock',this.nextBlock);
    }

    addScore(val:number){
        this.score+=val;
        this.scoreLabel.string='Score:'+this.score;
    }

    isMapMove:boolean
    //移动地图
    moveMap(offset:cc.Vec2){
        this.isMapMove=true;
        cc.tween(this.gameNode)
        .by(0.5,{position:cc.v3(offset.x,offset.y)})
        .call(()=>{
            this.isMapMove=false;
            this.addNextBlock();
        })
        .start();
    }

    gameOver(){
        this.gameOverNode.active=true;
        this.gameOverNode.emit('setScore',this.score);
    }
}
