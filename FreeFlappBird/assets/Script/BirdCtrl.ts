import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdCtrl')
export class BirdCtrl extends Component {

    // 重力加速度
    private gravity: number = -9.5 * 2;
    // 鸟在竖直方向上的速度
    private _vy: number = 0;
    private get vy(): number { return this._vy; }
    private SetVy(vy: number) {
        this._vy = vy;
        if (vy === 0) {
            this.node.angle = 0;
        } else {
            if (vy > 0) {
                this.node.angle = 10 * (Math.min(vy, 400) / 400);
            } else {
                this.node.angle = -30 * (Math.min(-vy, 400) / 400);
            }
        }
    }

    private isStartGame: boolean = false;

    StartGame() {
        this.isStartGame = true;
    }

    StopGame() {
        this.isStartGame = false;
    }

    OnUpdate(deltaTime: number) {
        if (!this.isStartGame) {
            return;
        }
        // 计算新的速度
        this.SetVy(this.vy + this.gravity * deltaTime);
        // 计算新的 y 方向位置
        let newY = this.node.position.y + this.vy * deltaTime;

        this.node.position = new Vec3(this.node.position.x, newY, this.node.position.z);
    }


    GetFootY(): number {
        return this.node.position.y - 24;
    }

    /** 将鸟设置到地面上方刚刚好的位置处 */
    SetBirdToGroundY(gourndY: number) {
        this.node.position = new Vec3(this.node.position.x, gourndY + 24, this.node.position.z);
    }

    /**
     * 重置位置
     */
    Reset() {
        this.node.position = new Vec3(this.node.position.x, 80, this.node.position.z);
        this.SetVy(0);
    }

    /**
     * 鸟跳跃
     * 利用冲量改变鸟的速度的特性，直接将速度更改为 400
     */
    Jump() {
        this.SetVy(400);
    }
}