const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    game: cc.Node = null;

    @property(cc.AudioClip)
    ballAudio:cc.AudioClip=null

    @property(cc.AudioClip)
    hitAudio:cc.AudioClip=null

    @property
    moveSpeed: number = 1000

    onLoad() {
        // 球方向随机
        let rigidBody = this.node.getComponent(cc.RigidBody)
        rigidBody.linearVelocity.x = Math.random() * -1200 + 600;
        rigidBody.linearVelocity.y = 1000;
    }

    //start () {}

    update() {
        //限制小球方向
        let rigidBody = this.node.getComponent(cc.RigidBody)
        if (rigidBody.linearVelocity.len() > this.moveSpeed) {
            let div = rigidBody.linearVelocity.len() / this.moveSpeed;
            rigidBody.linearVelocity = rigidBody.linearVelocity.divide(div);
        }
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {

        switch (other.tag) {
            case 0:
                //球撞到墙
                cc.audioEngine.play(this.ballAudio,false,0.8);
                break;
            case 1:
                //球撞到砖块
                other.node.destroy();
                this.game.emit('add');
                cc.audioEngine.play(this.hitAudio,false,0.5);
                break;
            case 2:
                //球撞到底部地面
                this.gameOver();
                break;
            case 3:
                //球撞到托盘
                break;
            default:
                cc.log('撞到未知物体');
        }
    }

    gameOver() {
        console.log('游戏结束');
        this.schedule(() => {
            cc.director.loadScene('1');
        }, 1);
    }

    gameWin() {
        console.log('恭喜过关！');
    }
}
