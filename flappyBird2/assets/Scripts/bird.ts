const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    jumpHeight: number = 800;

    @property(cc.AudioClip)
    wingClip:cc.AudioClip=null

    @property(cc.AudioClip)
    hitClip:cc.AudioClip=null

    @property(cc.AudioClip)
    pointClip:cc.AudioClip=null
    
    isGameStart: boolean = false;

    UILayer:cc.Node=null

    onLoad() {
        this.node.on('startGame', this.startGame, this);
        this.node.on('setUINode', this.setUINode, this);

        let rigid=this.node.getComponent(cc.RigidBody);
        rigid.gravityScale=0;
    }

    start() {

    }

    startGame() {
        this.isGameStart = true;
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        let rigid = this.node.getComponent(cc.RigidBody);
        rigid.gravityScale = 8;
    }

    gameOver() {
        this.isGameStart = false;  
        let rigid=this.node.getComponent(cc.RigidBody);
        rigid.enabledContactListener=false;
        rigid.angularVelocity=-360;
        this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.scheduleOnce(()=>{
            this.UILayer.emit('gameOver');
        },1);
    }

    setUINode(node:cc.Node){
        this.UILayer=node;
    }

    // update (dt) {}

    onTouchStart(e: cc.Event.EventTouch) {
        if (!this.isGameStart) {
            return;
        }

        //不允许飞出屏幕外
        if (this.node.y > cc.winSize.height / 2) {
            return;
        }

        this.flying();
    }

    //飞
    flying() {
        let rigid = this.node.getComponent(cc.RigidBody);
        rigid.linearVelocity = cc.v2(0, this.jumpHeight)

        cc.audioEngine.playEffect(this.wingClip,false);
    }

    onBeginContact(concat: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (!this.isGameStart) {
            return;
        }
        if (other.node.group == 'pumple') {
            cc.log('游戏结束');
            cc.audioEngine.playEffect(this.hitClip,false);
            this.gameOver();
        }
        if (other.node.group == 'tag') {
            cc.log('加分');
            this.UILayer.emit('addScore');
            cc.audioEngine.playEffect(this.pointClip,false);
        }
    }
}
