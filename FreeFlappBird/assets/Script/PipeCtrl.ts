import { _decorator, Component, instantiate, Node, Prefab ,Vec3} from 'cc';
import {GameConst} from './GameConst'
import { Pipe } from './Pipe';
import { BirdCtrl } from './BirdCtrl';
const { ccclass, property } = _decorator;

@ccclass('PipeCtrl')
export class PipeCtrl extends Component {
    @property({ type: Prefab, displayName: '管道预制体' }) private pipePrefab: Prefab = null!;

    /** 第一个管道在哪里生成 */
    private readonly startX: number = 600;
    /** 管道的间隔 */
    private readonly paddingX: number = 400;
    /** 管道数量 */
    private readonly pipeCnt: number = 3;
    /** [-300, 300] 的管道位置变化区间 */
    private readonly pipeRandomRange: number = 300;
    /** 下一次通过管道的位置 */
    private nextPassPositionX: number = 0;

    private _pipes: Pipe[] = [];

    /** 外部传进来的添加分数的方法 */
    private _addScore: Function;
    /**
     * 通过一个管道时加 1 分
     */
    private AddScore() {
        if (this._addScore) {
            this._addScore();
        }
    }

    StartGame(params: {
        addScore: Function,
    }) {
        this._addScore = params.addScore;
        this.m_MoveSwitch = true;
        if (this._pipes.length === 0) {
            // 初始化创建管道及设置位置
            for (let i = 0; i < this.pipeCnt; ++i) {
                let pipeNode = instantiate(this.pipePrefab);
                pipeNode.position = new Vec3(this.startX + i * this.paddingX, this.RandomY(), 0);
                this.node.addChild(pipeNode);
                const pipe = pipeNode.getComponent(Pipe);
                this._pipes.push(pipe);
            }
        }
        // 计算第一次通过管道时的位置
        const PIPE_WIDTH = 52;
        const BIRD_WIDTH = 68;
        this.nextPassPositionX = - this.startX - (PIPE_WIDTH + BIRD_WIDTH) / 2
    }

    /** 移动开关 false: 关 true: 开 */
    private m_MoveSwitch = false;
    SetEnableMove(isMoveable: boolean) {
        this.m_MoveSwitch = isMoveable;
    }

    OnUpdate(deltaTime: number) {
        if (!this.m_MoveSwitch) {
            return;
        }

        let newX = this.node.position.x - GameConst.MOVE_SPEED;
        this.node.position = new Vec3(newX, this.node.position.y, this.node.position.z);

        /** 新的位置，比目标管道位置还小，说明过了一个新管道：进行分数累加 */
        if (newX < this.nextPassPositionX) {
            this.AddScore();
            this.nextPassPositionX = this.nextPassPositionX - this.paddingX;
        }

        // 管道的位置超出了屏幕左侧
        if (newX + this._pipes[0].node.position.x < -375 - 26) {
            this._pipes[0].node.position = new Vec3(this._pipes[this.pipeCnt - 1].node.position.x + this.paddingX, this.RandomY(), 0);
            this._pipes.push(this._pipes[0]);
            this._pipes.splice(0, 1);
        }
    }

    Reset() {
        // 容器节点位置重置到原点
        this.node.position = new Vec3(0, 0, 0);
        // 管道位置重置
        for (let i = 0; i < this._pipes.length; ++i) {
            this._pipes[i].node.position = new Vec3(this.startX + i * this.paddingX, this.RandomY(), 0);
        }
    }

    private RandomY(): number {
        return this.pipeRandomRange * (Math.random() * 2 - 1);
    }


    /**
     * 鸟是否碰撞到管道
     * @param birdCtrl 鸟
     */
    CheckBirdCollision(birdCtrl: BirdCtrl): boolean {
        for (let i = 0; i < this._pipes.length; ++i) {
            const pipe = this._pipes[i];
            if (pipe.CheckBirdCollision(birdCtrl)) {
                return true;
            }
        }

        return false;
    }
}

