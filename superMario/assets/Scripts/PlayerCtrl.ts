
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerCtrl extends cc.Component {
    private body: cc.RigidBody = null;
    private dir: number = 0;

    start(): void {
        this.body = this.node.getComponent(cc.RigidBody);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onPlayerJump(): void {
        var v = this.body.linearVelocity;
        v.y += 600;
        this.body.linearVelocity = v;

    }

    private onPlayerHorMove(): void {
        var v = this.body.linearVelocity;
        v.x = (400 * this.dir);
        this.body.linearVelocity = v;

        this.node.scaleX = this.dir;
    }

    // e 键盘事件对象
    // 每个按键--->keycode, 
    // e, keyCode;
    private onKeyDown(e): void {
        switch(e.keyCode) {
            case 32: // space
                this.onPlayerJump();
            break;
            case 37: // left
                this.dir = -1;
            break;
            case 39: // right
                this.dir = 1;
            break;
        }
    }

    private onKeyUp(e): void {
        switch(e.keyCode) {
            case 32: // space
            break;
            case 37: // left
                this.dir = 0;
            break;
            case 39: // right
                this.dir = 0;
            break;
        }
    }

    update(dt): void {
        if (this.dir !== 0) {
            this.onPlayerHorMove();
        }
    }
}
