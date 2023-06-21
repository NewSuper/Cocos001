import { RunState } from "../model/RunState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    rigid: cc.RigidBody = null;
    state: RunState
    onLoad() {
        this.state = RunState.run;
        this.rigid = this.node.getComponent(cc.RigidBody);
    }

    start() {

    }

    //切换状态
    setState(status: RunState) {
        //状态不能相同
        if (status == this.state) {
            return;
        }
        this.state = status;
        let animation = this.node.getComponent(cc.Animation);
        animation.play(status);
    }

    //跳跃
    onJump() {
        switch (this.state) {
            case RunState.run:
                this.rigid.linearVelocity = cc.v2(0, 800);
                this.setState(RunState.jump);
                break;
            case RunState.jump:
                this.rigid.linearVelocity = cc.v2(0, 600);
                this.setState(RunState.double_jump);
                break;
        }
    }

    //落地
    onFloor() {
        switch (this.state) {
            case RunState.jump:
            case RunState.double_jump:
                this.setState(RunState.run)
                break;
        }
    }

    update(dt) {
        let v = this.rigid.linearVelocity;
        v.x = 0;
        this.rigid.linearVelocity = v;
        if(this.node.y<-cc.winSize.height){
            this.node.parent.emit('gameover');
            this.node.active=false;
        }
       
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (other.node.group == 'platform') {
            let selfBox = self.node.getBoundingBox();
            let otherBox = other.node.getBoundingBox();
            //如果是从下方向,或者是左边进入就不会发生碰撞
            if (selfBox.yMin < otherBox.y || selfBox.xMax < otherBox.xMin) {
                contact.disabled = true;
                return
            }
            this.onFloor();
        }
        else if (other.node.group == 'glod') {
            this.node.parent.emit('addScore');
            other.node.destroy();
        }
    }

    onEndContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (other.node.group == 'platform') {
            this.setState(RunState.jump);
        }
    }
}
