import {  Global_Date } from "../Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property([cc.SpriteFrame])
    BoomFrame: cc.SpriteFrame[] = []

    onLoad() {
        this.changeType(Global_Date.fruitType);
    }

    changeType(type: number) {
        type = this.checkType(type);
        let sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = this.atlas.getSpriteFrames()[type];

        let physics = this.node.getComponent(cc.PhysicsCircleCollider);
        physics.tag = type;
        physics.radius=this.node.width/2;
        physics.apply();
    }

    checkType(type: number): number {
        if (type < 0) {
            return 0;
        }
        const length = this.atlas.getSpriteFrames().length;
        if (type >= length) {
            return length - 1;
        }
        return type;
    }

    // update (dt) {}

    //碰撞逻辑
    onBeginContact(
        contact: cc.PhysicsContact,
        self: cc.PhysicsCollider,
        other: cc.PhysicsCollider) {
        if (other.node.group != "default") {
            return;
        }
        if (self.tag == other.tag && other.tag != 10) {
            if (self.node.y < other.node.y) {
                console.log("碰撞", other.tag)
                other.node.destroy();
                this.watermelonBoom(self.tag);
            } else {
                this.node.destroy();
                return;
            }
        }
    }

    //西瓜爆炸
    watermelonBoom(type: number) {
        let sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = this.BoomFrame[type];
        let rigidBody = this.node.getComponent(cc.RigidBody);
        rigidBody.enabledContactListener=false;
        this.scheduleOnce(() => {
            rigidBody.enabledContactListener=true;
            this.changeType(type + 1);
            Global_Date.Score += (type + 1) * 2
            this.node.parent.emit('addScore');
        }, 0.2);

        // 播放音乐
        this.node.getComponent(cc.AudioSource).play();
    }
}
