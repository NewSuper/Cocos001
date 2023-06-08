
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioClip)
    apartAudio:cc.AudioClip=null

    @property(cc.Color)
    color: cc.Color = null;

    attack: boolean = false;

    onLoad() {
        let motion = this.node.getComponent(cc.MotionStreak);
        motion.color = this.color;
    }

    start() {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    // update (dt) {}

    startPos: cc.Vec2;
    onTouchStart(e: cc.Event.EventTouch) {
        let motion = this.node.getComponent(cc.MotionStreak);
        motion.reset();
        this.startPos = e.getLocation();
    }

    onTouchMove(e: cc.Event.EventTouch) {
        let v2 = this.node.parent.convertToNodeSpaceAR(e.getLocation());
        this.node.x = v2.x;
        this.node.y = v2.y;

        let len = e.getLocation().sub(this.startPos).len();       //开始触摸和移动的距离
        if (len > 50) {
            this.attack = true;
        }
    }

    onTouchEnd(e: cc.Event.EventTouch) {
        this.attack = false;
    }


    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (!this.attack) {
            return;
        }
        let canvas=cc.Canvas.instance;
        if (other.node.group == 'fruit') {
            other.node.emit('apart');
            canvas.node.emit('addScore');
            cc.audioEngine.playEffect(this.apartAudio,false);
        }
        else if(other.node.group=='boom'){
            canvas.node.emit('boomLight');
            this.node.active=false;
        }
    }
}
