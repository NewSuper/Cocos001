const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed = 0;

    @property(cc.Node)
    limit: cc.Node = null;

    a = false;
    d = false;
    w = false;
    s = false;

    onKeyDown(event) {
        if (event.keyCode == cc.macro.KEY.a || event.keyCode == cc.macro.KEY.left) {
            this.a = true;
        }
        if (event.keyCode == cc.macro.KEY.d || event.keyCode == cc.macro.KEY.right) {
            this.d = true;
        }
        if (event.keyCode == cc.macro.KEY.w || event.keyCode == cc.macro.KEY.right) {
            this.w = true;
        }
        if (event.keyCode == cc.macro.KEY.s || event.keyCode == cc.macro.KEY.right) {
            this.s = true;
        }
    }

    onkeyup(event) {
        if (event.keyCode == cc.macro.KEY.a || event.keyCode == cc.macro.KEY.left) {
            this.a = false;
        }
        if (event.keyCode == cc.macro.KEY.d || event.keyCode == cc.macro.KEY.right) {
            this.d = false;
        }
        if (event.keyCode == cc.macro.KEY.w || event.keyCode == cc.macro.KEY.right) {
            this.w = false;
        }
        if (event.keyCode == cc.macro.KEY.s || event.keyCode == cc.macro.KEY.right) {
            this.s = false;
        }
    }

    inArea(v2: cc.Vec2): boolean {
        if (this.limit === null) {
            return true;
        }
        return this.limit.getBoundingBox().contains(v2);
    }

    start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onkeyup, this);
    }

    update(dt) {
        let v2: cc.Vec3 = this.node.position;
        //左 右
        if (this.a) {
            v2.x = this.node.x - this.speed * dt;
        }
        if (this.d) {
            v2.x = this.node.x + this.speed * dt;
        }
        if (this.inArea(cc.v2(v2))) {
            this.node.position = v2;
        }

        //上 下
        if (this.w) {
            v2.y = this.node.y + this.speed * dt;
        }
        if (this.s) {
            v2.y = this.node.y - this.speed * dt;
        }
        if (this.inArea(cc.v2(v2))) {
            this.node.position = v2;
        }
    }
}
