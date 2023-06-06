
import { _decorator, Component, Node, find, Prefab, instantiate } from 'cc';
import { BallonCtrl } from './BallonCtrl';
const { ccclass, property } = _decorator;


@ccclass('GameApp')
export class GameApp extends Component {

    @property(Prefab)
    private prefabBall: Prefab = null;

    private uiHome: Node = null;
    private uiGame: Node = null;

    @property(Node)
    private ballRoot: Node = null;

    private ulevel: number = 1; // 当前玩家第几关;
    private totalNum: number = 0; // 当前关卡要产生多少个气球结束;
    private nowNum: number = 0; // 记录一下已经产生了多少个;

    onLoad(): void {
        this.uiHome = find("Canvas/UIHome");
        this.uiGame = find("Canvas/UIGame");

        this.EnterHomeScene();
    }

    private ClearGame(): void {
        // 清理掉所有的气球
        this.ballRoot.destroyAllChildren();
        // end

        // 清理我们的定时器
        this.unscheduleAllCallbacks();
        // end
    }

    public EnterHomeScene(): void {
        this.ClearGame();

        this.uiGame.active = false;
        this.uiHome.active = true;
    }

    public OnStartGameClick(): void {
        this.EnterGameScene();
    }

    private GenBall(): void {
        // 创建一个气球出来，你后续可以用节点池;
        var ball = instantiate(this.prefabBall);
        this.ballRoot.addChild(ball);
        ball.addComponent(BallonCtrl).Init();
        // end

        // 
        this.nowNum ++;
        if(this.nowNum >= this.totalNum) { 
            // 气球创建完毕，马上游戏要结束了;
            console.log("气球生成结束");
            return;
        }
        // end

        var time = 1 + Math.random() * 1;
        this.scheduleOnce(()=>{
            this.GenBall();
        }, time);
    }

    private _StartGame(): void {
        // 读取我们的玩家数据, 我是第几关，你这关要多少个气球
        this.ulevel = 1;
        this.totalNum = 10;
        this.nowNum = 0;
        // end

        // 开始产生我们的气球
        this.GenBall();
        // end 
    }

    public EnterGameScene(): void {
        //  清理一下游戏
        this.ClearGame();
        // end

        this._StartGame();
        this.uiHome.active = false;
        this.uiGame.active = true;
    }


}

