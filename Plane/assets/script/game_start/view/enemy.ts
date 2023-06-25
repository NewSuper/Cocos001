import { Global } from '../model/global'
const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property
    speedMax: number = 600;
    @property
    speedMin: number = 300;

    @property
    life = 1;

    @property
    score = 100

    _speed: number;

    isDie:boolean=false;

    onLoad() {
        this.node.on('die', this.die, this);
    }

    start() {
        this._speed = (Math.random() * (this.speedMax - this.speedMin) + this.speedMin);
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 20);
    }

    update(dt) {
        this.node.y -= this._speed * dt;
    }

    die() {
        if(this.isDie){
            return;
        }
        this.isDie=true;
        this.node.getComponent(cc.Collider).enabled = false;
        let animation = this.node.getComponent(cc.Animation);
        animation.on(cc.Animation.EventType.FINISHED, this.removeThis, this);
        let clipName = animation.getClips()[0].name;
        animation.play(clipName)
        Global.score += this.score;

    }

    removeThis() {
        this.node.destroy();
    }

    collision() {
        this.life--;
        if (this.life > 0)
            return;
       
        this.die();
    }


    //碰撞回调
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.collision();

    }

    //碰撞结束前调用
    onCollisionStay(other, self) {

    }

    //碰撞结束后调用
    onCollisionExit(other, self) {


    }

    onDestroy() {

    }
}
