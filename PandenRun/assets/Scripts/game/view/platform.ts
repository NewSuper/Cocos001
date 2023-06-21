import { Data } from "../model/Data";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    // onLoad () {}

    rigid: cc.RigidBody = null
    start() {
        this.rigid = this.node.getComponent(cc.RigidBody);
    }

    update(dt) {
        if (this.rigid == null) {
            return;
        }
        let velocity = this.rigid.linearVelocity;
        velocity.y = 0;
        velocity.x = -Data.speed;
        this.rigid.linearVelocity = velocity;

        let box = this.node.getBoundingBox();
        if (box.xMax < -cc.winSize.width / 2) {
            this.scheduleOnce(() => {
                cc.log('平台销毁');
                this.node.parent.emit('spawnPlatform');
                this.node.destroy();
            }, 1);
        }
    }
}
