import { Global } from "../model/global";
import { ItemType } from "../type/ItemTypeState";

const { ccclass, property } = cc._decorator;

enum BulletType {
    one,
    double,
}

@ccclass
export default class Plane extends cc.Component {

    @property(cc.Node)
    canvas: cc.Node = null;

    @property(cc.Prefab)
    bullet: cc.Prefab = null;

    public bulletType: BulletType = BulletType.one;


    isGameOver: boolean = false;

    onLoad() {
        this.node.on('getItem', this.getItem, this);
    }

    start() {
        this.schedule(this.spawnBullet, 0.1);
    }

    getItem(type: ItemType) {
        switch (type) {
            case ItemType.bomb:
                Global.bombSize++;
                break;

            case ItemType.fire:
                this.bulletType = BulletType.double;
                this.scheduleOnce(() => {
                    this.bulletType = BulletType.one;
                }, 8);
                break;
        }

    }

    //生成子弹
    spawnBullet() {
        if (this.isGameOver) {
            return
        }
        switch (this.bulletType) {
            case BulletType.one:
                let bullet = cc.instantiate(this.bullet);
                bullet.position = this.node.position;
                this.canvas.addChild(bullet);
                break;
            case BulletType.double:
                //左边子弹
                let bulletLeft = cc.instantiate(this.bullet);
                bulletLeft.position = this.node.position;
                bulletLeft.x += 30;
                this.canvas.addChild(bulletLeft);
                //右边子弹
                let bulletRight = cc.instantiate(this.bullet);
                bulletRight.position = this.node.position;
                bulletRight.x -= 30;
                this.canvas.addChild(bulletRight);
                break;
        }
    }

    //飞机碰撞
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'enemy') {
            let collision = this.node.getComponent(cc.BoxCollider);
            collision.enabled = false;
          
            let animation = self.node.getComponent(cc.Animation)
            animation.play('player_down');
            this.gameOver();
        }
        // if (other.node.group == 'UFO') {

        // }
    }

    gameOver() {
        this.isGameOver = true;
        this.unschedule(this.spawnBullet);
        cc.sys.localStorage.setItem('currentScore',Global.score);
        
        let animation = this.node.getComponent(cc.Animation);
        animation.on(cc.Animation.EventType.FINISHED, this.player_down, this);
        animation.play('player_down');
    }

    //飞机坠毁
    player_down() {
        this.node.opacity=0;
        this.scheduleOnce(() => {
            cc.log("load scene restart");
            cc.director.loadScene('restart');
            this.node.removeFromParent(true);
            //将节点活动停止就不会再执行任何脚本代码了    
        }, 1);
       
    }

    useBomb() {
        if (Global.bombSize > 0) {
            Global.bombSize--;
            this.node.parent.emit('destroyAllEnemy');
        }

    }

    // update (dt) {}
}
