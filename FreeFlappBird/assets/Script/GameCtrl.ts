import { _decorator, Component, EventTouch, Input, Label, Node } from 'cc';
import { Ground } from './Ground';
import { BirdCtrl } from './BirdCtrl';
import { LoseUI } from './LoseUI';
import { UIMgr } from './Lib/UIMgr';
import { PipeCtrl } from './PipeCtrl';
import { GameData } from './GameData';
import { AudioMgr } from './AudioMgr';
import { AudioConfig } from './GameConst';

const { ccclass, property } = _decorator;


enum EGameOverType {
    /** 掉到地面 */
    FailToGround,
    /** 碰到管道 */
    CollisionToPipe,
}

@ccclass('GameCtrl')
export class GameCtrl extends Component {

    @property({ type: Node, displayName: "开始按钮（全屏）StartScreen" }) private startScreen: Node = null!;
    @property({ type: Label, displayName: "分数" }) private scoreLabel: Label = null!;
    @property({ type: Ground, displayName: "地面控制器" }) private groundCtrl: Ground = null!;
    @property({ type: BirdCtrl, displayName: "鸟控制器" }) private birdCtrl: BirdCtrl = null!;
    @property({ type: PipeCtrl, displayName: "管道控制器" }) private pipeCtrl: PipeCtrl = null!;

    private m_IsGameOver: boolean = false;


    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.scoreLabel.node.active = false;
    }

    update(deltaTime: number) {
        this.groundCtrl.OnUpdate(deltaTime);
        this.birdCtrl.OnUpdate(deltaTime);
        this.pipeCtrl.OnUpdate(deltaTime);

        // 游戏没结束，那么做结束判定：鸟是否掉在地面上导致游戏结束
        if (!this.m_IsGameOver) {
            // 如果鸟碰到了地面，那么游戏结束
            if (this.groundCtrl.CheckBirdCollision(this.birdCtrl)) {
                // 掉在地面上了-游戏结束了
                this.handleGameOver(EGameOverType.FailToGround);
                return;
            }

            if (this.pipeCtrl.CheckBirdCollision(this.birdCtrl)) {
                this.handleGameOver(EGameOverType.CollisionToPipe);
                return;
            }
        }
    }

    /** 用户输入：点击屏幕开始游戏 */
    clickStart() {
        // 清除上一局分数
        GameData.getInstance().SetScore(0);
        // 同步label显示
        this.RefreshScoreLabel();
        // 显示分数标签
        this.scoreLabel.node.active = true;
        this.startScreen.active = false;
        // 标记游戏没有结束
        this.m_IsGameOver = false;
        // 设置地面可以开始移动
        this.groundCtrl.SetEnableMove(true);
        // 设置鸟开始启用重力系统
        this.birdCtrl.StartGame()
        // 管道开始生成
        this.pipeCtrl.StartGame({
            addScore: () => this.AddScore()
        });
    }

    resetGame() {
        // 显示 Tap to Start 节点
        this.startScreen.active = true;
        // 隐藏分数
        this.scoreLabel.node.active = false;
        // 重置鸟的位置
        this.birdCtrl.Reset();
        this.pipeCtrl.Reset();
    }

    handleGameOver(gameOverType: EGameOverType) {
        this.m_IsGameOver = true;
        this.birdCtrl.StopGame()
        this.groundCtrl.SetEnableMove(false);
        this.pipeCtrl.SetEnableMove(false);

        AudioMgr.getInstance().playOneShot(AudioConfig.hit);
        if (gameOverType === EGameOverType.CollisionToPipe) {
        } else {
             AudioMgr.getInstance().playOneShot(AudioConfig.die);
        }

        // 弹出失败界面
        UIMgr.getInstance().open<LoseUI_UIData>(LoseUI, {
            closeHandler: () => this.resetGame(),
            score: GameData.getInstance().Score,
        });
    }

    /**
     * 跳跃行为
     */
    tapToJump() {
        this.birdCtrl.Jump();

        AudioMgr.getInstance().playOneShot(AudioConfig.swoosh);
    }

    /** 捕获玩家点击屏幕事件 */
    onTouchStart() {
        this.tapToJump();
    }

    /**
     * 添加分数
     */
    AddScore() {
        const newScore = GameData.getInstance().Score + 1;
        GameData.getInstance().SetScore(newScore);
        // UI 刷新
        this.RefreshScoreLabel();

        AudioMgr.getInstance().playOneShot(AudioConfig.point);
    }

    /** 刷新分数显示 */
    RefreshScoreLabel() {
        this.scoreLabel.string = `分数：${GameData.getInstance().Score}`;
    }
}

