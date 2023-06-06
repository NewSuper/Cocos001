
import { _decorator, Component, Node, sp, view, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum BallState {
    Ready = 1, // 球准备好了；
    Running = 2, // 球在往上跑的一个状态;
    Died = 3, // 球死亡的状态;

}

@ccclass('BallonCtrl')
export class BallonCtrl extends Component {
    private ballType: number = 0; // 球的类型;
    private anim: sp.Skeleton = null;

    private ballIdleAnim: string = null;
    private ballBoomAnim: string = null;

    private state: number = 0;
    private speed: number = 0;

    public Init(): void {
        this.anim = this.node.getComponentInChildren(sp.Skeleton)
        // 我们这个球到底是哪个颜色
        this.ballType = Math.floor(Math.random() * 7) + 1; // [0, 7)
        this.ballBoomAnim = "animation_" + this.ballType + "_click";
        this.ballIdleAnim = "animation_" + this.ballType + "_stop";
        this.anim.animation = this.ballIdleAnim;
        // end

        // 配置我们的球的参数: 大小，位置
        // scale 0.1, 0.6
        var scale = 0.1 + Math.random() * 0.4; // [0.1~0.6)
        this.node.setScale(0, 0);
        // end

        // 根据根据关卡配置的速度范围，我们随机一个;
        var minSpeed = 300;
        var maxSpeed = 500;
        this.speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        // 位置
        var x = Math.random() * view.getFrameSize().width - view.getFrameSize().width * 0.5;
        var y = Math.random() * view.getFrameSize().height * 0.75 - view.getFrameSize().height * 0.5;
        this.node.setPosition(x, y);
        // end

        this.state = BallState.Ready; 
        // 进场动画, 如果这个动画没有完成，我们这个球是不往上跑的;
        var t = tween(this.node); // 创建一个tween对象
        t.to(0.3, {scale: new Vec3(scale, scale, scale)});
        t.call(()=>{
            if(this.state === BallState.Ready) {
                this.state = BallState.Running;
            }
        });
        t.start();

        // 监听我们的戳破事件
        var trigger = this.node.getChildByName("trigger");
        trigger.on(Node.EventType.TOUCH_START, this.onBreakBall, this);
        // end
    }

    private onBreakBall(): void {
        if(this.state !== BallState.Running && this.state !== BallState.Ready) {
            return;
        }

        this.state = BallState.Died;
        this.anim.animation = this.ballBoomAnim;
        this.anim.setCompleteListener(()=>{
            this.node.destroy();
        })
    }

    private onBallDied(): void {
        if(this.state === BallState.Died) {
            return;
        }

        this.state = BallState.Died;
        this.node.destroy();
        console.log("onBallDied");
    }

    onDestroy(): void {
        this.onBallDied();
    }

    update(dt: number): void {
        if(this.state !== BallState.Running) {
            return;
        }

        var pos = this.node.getPosition();
        pos.y += (this.speed * dt);
        this.node.setPosition(pos);


        if(pos.y >= 960) {
            this.onBallDied();
        }
    }
}


