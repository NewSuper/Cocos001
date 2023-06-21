import { Data } from "../model/Data";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    rigid: cc.RigidBody = null

    onLoad() {

    }
    start() {
    }

    update(dt) {
        this.rigid=this.node.getComponent(cc.RigidBody);
        let velocity = this.rigid.linearVelocity;
        velocity.y = 0;
        velocity.x = -Data.speed;
        this.rigid.linearVelocity = velocity;
        if (this.node.x < -cc.winSize.width / 2) {
            this.node.destroy();
        }
    }
}
