import Block from "./Block";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed: number = 150;

    @property
    power: number = 150;

    @property(cc.AudioClip)
    audioPress: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioRepeat: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioFail: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioSuccess: cc.AudioClip = null;

    radio: number = 0.556;

    playerNode: cc.Node = null
    motion: cc.MotionStreak = null;
    particle: cc.ParticleSystem = null

    nextBlock: cc.Node = null

    isJumping: boolean = false;
    isPowerMode: boolean = false;

    x_distance: number = 0;         //跳跃的距离

    initSpeed: number = 0;          //初始化跳跃速度

    direction: number = 1;          //跳跃的方向

    inBlock: boolean = true;           //玩家是否在方块中

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.playerNode = this.node.getChildByName('piece');
        this.motion = this.node.getComponent(cc.MotionStreak);
        //从子节点中进行寻找
        this.particle = this.node.getComponentInChildren(cc.ParticleSystem);
        this.initSpeed = this.speed;

        this.node.on('setNextBlock', this.setNextBlock, this);
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        //关闭粒子特效
        this.particle.stopSystem();
    }

    update(dt) {
        if (this.isPowerMode) {
            this.speed += this.power * dt;
            this.x_distance += this.speed * dt;
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {
        if (this.isJumping) {
            return;
        }
        this.isPowerMode = true;
        this.x_distance = 0;
        this.speed = this.initSpeed;
        this.particle.resetSystem();        //启动粒子效果
        this.actionReady();                 //准备起跳动画
        this.playerSound();
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        if (!this.isPowerMode) {
            return;
        }
        this.isPowerMode = false;
        this.particle.stopSystem();
        this.actionNormal();
        this.playJump();
        this.stopSound();
    }

    setNextBlock(next: cc.Node) {
        this.nextBlock = next;
    }

    playJump() {
        this.isJumping = true;
        this.motion.enabled=true;

        //跳跃方向和距离
        let xdistance = this.x_distance * this.direction;
        let ydistance = this.x_distance * this.radio;

        //目标位置
        let targetPos = this.node.position;
        targetPos.x += xdistance;
        targetPos.y += ydistance;
        ydistance=targetPos.sub(this.node.position).y;

        this.actionJump(targetPos, ydistance);

    }

    //跳跃结束之后执行的函数
    JumpEnd(targetPos: cc.Vec3, y_distance: number) {

        this.isJumping = false;
        this.motion.enabled=false;
        //全局坐标
        let wpos = this.node.parent.convertToWorldSpaceAR(targetPos);
        let jumpScore: number = this.nextBlock.getComponent(Block).jumpTarget(wpos);
        let canvas = cc.Canvas.instance;
        
        //修改方向
        if (Math.random() > 0.5) {
            this.direction = -this.direction;
        }
        cc.log(this.inBlock);
        if (this.inBlock && jumpScore > 0) {
            canvas.node.emit('addScore', jumpScore);
            let offset: cc.Vec2;
            if (this.direction == -1) {
                offset = cc.v2(500 - wpos.x, -y_distance);
            }
            else {
                offset = cc.v2(100 - wpos.x, -y_distance)
            }

            canvas.node.emit('moveMap', offset);
        }
        else if(!this.inBlock){
            cc.audioEngine.playEffect(this.audioFail,false);
            canvas.node.emit('gameOver');
        }
    }

    //准备起跳动画
    actionReady() {
        this.playerNode.stopAllActions();
        cc.tween(this.playerNode)
            .to(2, { scaleY: 0.5 })
            .start();
    }
    //还原动画
    actionNormal() {
        this.playerNode.stopAllActions();
        cc.tween(this.playerNode)
            .to(0.5, { scaleY: 1 })
            .start();
    }

    //跳跃动画
    actionJump(target: cc.Vec3, ydistance: number) {
        let jump = cc.jumpTo(0.5, cc.v2(target), 200, 1);
        cc.tween(this.node)
            .by(0.5, { angle: -360 * this.direction })
            .start();
        cc.tween(this.node)
            .then(jump)
            .call(() => { this.JumpEnd(target, ydistance) })
            .start()
    }

    pressId: number;       //播放音乐的id
    repeatId: number;
    repeatPlay: boolean;//是否是重复播放
    callBack: Function;

    //播放音乐
    playerSound() {
        this.pressId = cc.audioEngine.playEffect(this.audioPress, false);
        let audioTime = cc.audioEngine.getDuration(this.pressId);
        this.repeatPlay =false;
        //重复播放音乐
        this.callBack = () => {
            this.repeatPlay = true;
            this.repeatId = cc.audioEngine.playEffect(this.audioRepeat, true);
        }

        this.scheduleOnce(this.callBack, audioTime);
    }

    stopSound() {
        this.unschedule(this.callBack);
        cc.audioEngine.stopEffect(this.pressId);
        if (this.repeatPlay) {
            cc.audioEngine.stopEffect(this.repeatId);
        }
    }


    //开始发生碰撞
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'block') {
            this.inBlock = true;
        }
    }

    //结束碰撞
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'block') {
            this.inBlock = false;
        }
    }

    onDestroy(){
        cc.audioEngine.stopAllEffects();
    }
}
