const {ccclass, property} = cc._decorator;


//鸟
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    scoreLabel:cc.Label=null

    @property(cc.Node)
    startNode:cc.Node=null

    @property(cc.Node)
    tutorial:cc.Node=null

    @property(cc.Node)
    bird:cc.Node=null

    @property(cc.Node)
    spawnPumple:cc.Node=null;

    @property(cc.Node)
    gameOverNode:cc.Node=null;

    @property(cc.AudioClip)
    swooshClip:cc.AudioClip=null

    @property(cc.AudioClip)
    dieClip:cc.AudioClip=null

    score=0;

    onLoad () {
        this.tutorial.on(cc.Node.EventType.TOUCH_START,this.gameStart,this);
        this.node.on('gameOver',this.gameOver,this);
        this.node.on('addScore',this.addScore,this);

        
    }
    start(){
        this.bird.emit('setUINode',this.node);
    }
    // update (dt) {}

    addScore(){
        this.score++;
        this.scoreLabel.string=this.score.toString();
    }

    gameStart(){
        this.startNode.active=false;
        this.scoreLabel.node.active=true;
        this.bird.emit('startGame');
        this.spawnPumple.emit('startGame');

        cc.audioEngine.playEffect(this.swooshClip,false);
    }

    gameOver(){
        this.gameOverNode.active=true;
        this.scoreLabel.node.active=false;
        this.gameOverNode.emit('setScore',this.score);
        let anim=this.gameOverNode.getComponent(cc.Animation);
        anim.play('game_over');
        cc.audioEngine.playEffect(this.dieClip,false);
    }

    //TODO,制作一个更换皮肤的功能,目前直接使用复制的场景完成替换
    restart(){
        let gamename='game';
        let random=Math.random()*3+1 | 0;
        cc.log(gamename+random);
        cc.director.loadScene(gamename+random);
    }

   
}
