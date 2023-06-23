
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed:number=1000;


    onLoad(){}

    start() {
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.touchStart, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
    }

    touchStart(e: cc.Event.EventTouch) {
        let pos = this.node.parent.convertToNodeSpaceAR(e.getLocation());
        this.node.x = pos.x;
    }

    moveDir: string;

    onKeyDown(event) {
        // 控制bar左右移动
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.moveDir = 'left';
                break;

            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.moveDir = 'right';
                break;
        }
    }

    onKeyUp(event) {
        this.moveDir = '';
    }

    update(dt) {
        this.movePaddle(dt);
    }

   
    movePaddle(dt) {

        let pos=this.node.position;
        if (this.moveDir == 'left') {
            pos.x-= this.speed * dt;
        }
        else if (this.moveDir == 'right') {
            pos.x += this.speed * dt;
        }
        // 限制bar
        let parent=this.node.parent;
        if(parent.getBoundingBox().contains(cc.v2(pos))){
            this.node.position=pos;
        }
    }
}
