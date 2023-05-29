
import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, view, UITransform, Label, EventTouch, tween, AudioClip, AudioSource, resources, director } from 'cc';
import { blockControl } from './blockControl';
const { ccclass, property } = _decorator;
const blockNum = 4   //4x4方格
var blockSize = 162.5   //方块大小
const gap = 10   //方块间隔
const MOVE_DAURATION = 0.2  //方块缓动时间



@ccclass('game')
export class game extends Component {

    @property(Prefab)
    private blockPrefab: Prefab = null
    @property(AudioClip)
    public audioMove: AudioClip = null
    @property(AudioClip)
    public audioMerge: AudioClip = null
    @property(AudioSource)
    public audioSource: AudioSource = null

    private score: number = 0 //分数
    private best: number = 0  //最好成绩
    private next: number = 2  //下一个出现的方块数字
    private positions: Vec3[][] = [[], [], [], []]   // 各个块的位置
    private numbers: number[][] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]   //各个块里的数字
    private blocks: Node[][] = [[], [], [], []] // 已有的块

    start() {
        this.addEventHandler()  //事件监听
        //重新开始按钮事件
        this.node.getChildByName("reset").on(Node.EventType.TOUCH_START, (e: TouchEvent) => {
            this.init()
        }, this)
    }
    onLoad() {
        //微信小游戏允许分享
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        //结算、排行榜不显示
        this.node.getChildByName("gameover").active = false
        this.node.getChildByName("rank").active = false
        //初始化音频组件
        this.audioSource = this.node.getComponent(AudioSource)
        //最高分缓存
        if (localStorage.getItem("best")) {
            this.best = parseInt(localStorage.getItem("best"))
        }
        else {
            localStorage.setItem("best", "0")
        }

        //方格背景设计宽度
        let bgWidth = 360
        blockSize = (bgWidth - gap * (blockNum + 1)) / blockNum
        this.init()
    }

    //初始化，随机两个方块
    init() {
        this.score = 0
        localStorage.setItem("score", "0")
        this.best = parseInt(localStorage.getItem("best"))
        this.positions = [[], [], [], []]
        this.blocks = [[], [], [], []]
        this.numbers = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        this.node.getChildByName("score").getChildByName("num").getComponent(Label).string = this.score + ""
        this.node.getChildByName("best").getChildByName("num").getComponent(Label).string = this.best + ""
        this.initBlocks()
        this.randomBlock()
        this.randomBlock()
    }

    //绘制4x4空方格
    initBlocks() {
        let x = gap + blockSize / 2
        let y = gap + blockSize / 2
        for (let row = 0; row < blockNum; row++) {
            for (let col = 0; col < blockNum; col++) {
                let block = instantiate(this.blockPrefab)
                //设置方格大小
                block.getComponent(UITransform).width = blockSize
                block.getComponent(UITransform).height = blockSize
                let bg = block.getChildByName("bg")
                bg.getComponent(UITransform).width = blockSize
                bg.getComponent(UITransform).height = blockSize
                this.node.getChildByName("square").addChild(block)
                //方块位置
                let vec3 = new Vec3(x, y, 0)
                this.positions[row][col] = vec3
                block.setPosition(vec3)
                block.getComponent(blockControl).setNumber(0)
                x += gap + blockSize
            }
            x = gap + blockSize / 2
            y += gap + blockSize
        }
    }

    //随机一个方块
    randomBlock() {
        let positions = this.getEmptyPositions()
        if (positions.length == 0) {
            return false
        } else {
            let position = positions[Math.floor(Math.random() * positions.length)]
            let row = position.row
            let col = position.col
            this.numbers[row][col] = this.next
            let block = instantiate(this.blockPrefab)
            block.getComponent(UITransform).width = blockSize
            block.getComponent(UITransform).height = blockSize
            let bg = block.getChildByName("bg")
            bg.getComponent(UITransform).width = blockSize
            bg.getComponent(UITransform).height = blockSize
            this.node.getChildByName("square").addChild(block)
            this.blocks[row][col] = block
            block.setPosition(this.positions[row][col])
            block.getComponent(blockControl).setNumber(this.next)
            this.next = (Math.floor(Math.random() * 2) + 1) * 2
            this.node.getChildByName("next").getChildByName("nextNum").getComponent(Label).string = this.next + ""
            return true
        }
    }

    //空位置
    getEmptyPositions() {
        let pos = []
        for (let i = 0; i < this.positions.length; i++) {
            for (let j = 0; j < this.positions[i].length; j++) {
                if (this.numbers[i][j] == 0) {
                    pos.push({ row: i, col: j })
                }
            }
        }
        return pos
    }

    //监听滑动事件
    addEventHandler() {
        let vec1: Vec2, vec2: Vec2
        this.node.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
            vec1 = e.getLocation()
        }, this)
        this.node.on(Node.EventType.TOUCH_END, (e: EventTouch) => {
            vec2 = e.getLocation()
            this.getDirection(vec1, vec2)
        }, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, (e: EventTouch) => {
            vec2 = e.getLocation()
            this.getDirection(vec1, vec2)
        }, this)
    }

    //判断滑动方向
    getDirection(v1, v2) {
        let distance = Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))
        if (distance > 100) {
            let distanceH = Math.abs(v1.x - v2.x)
            let distanceV = Math.abs(v1.y - v2.y)
            if (distanceH > distanceV) {//左右
                if (v1.x < v2.x) {//向右
                    this.moveRight()
                } else {//向左
                    this.moveLeft()
                }
            } else {//上下
                if (v1.y > v2.y) {//向下
                    this.moveDown()
                } else {//向上
                    this.moveUp()
                }
            }
        }
    }

    moveRight() {
        let flag = 0//标记：0 无效滑动  1方块移动 2方块合并
        for (let row = 0; row < blockNum; row++) {
            for (let col = blockNum - 1; col > 0; col--) {
                let nextCol = col - 1
                while (nextCol >= 0) {
                    let num1 = this.numbers[row][col]
                    let num2 = this.numbers[row][nextCol]
                    if (num1 == 0) {
                        if (num2 != 0) {
                            this.moveBlock(row, nextCol, row, col)
                            if (flag == 0) flag = 1
                        }
                        else {
                            nextCol--
                        }
                    } else {
                        if (num2 == 0) {
                            nextCol--
                        } else if (num2 == num1) {
                            this.mergeBlock(row, nextCol, row, col)
                            flag = 2
                            break
                        } else {
                            break
                        }
                    }
                }

            }
        }
        this.afterMove(flag)
    }

    moveLeft() {
        let flag = 0
        for (let row = 0; row < blockNum; row++) {
            for (let col = 0; col < blockNum - 1; col++) {
                let nextCol = col + 1
                while (nextCol < blockNum) {
                    let num1 = this.numbers[row][col]
                    let num2 = this.numbers[row][nextCol]
                    if (num1 == 0) {
                        if (num2 != 0) {
                            this.moveBlock(row, nextCol, row, col)
                            if (flag == 0) flag = 1
                        }
                        else {
                            nextCol++
                        }
                    } else {
                        if (num2 == 0) {
                            nextCol++
                        } else if (num2 == num1) {
                            this.mergeBlock(row, nextCol, row, col)
                            flag = 2
                            break
                        } else {
                            break
                        }
                    }
                }

            }
        }
        this.afterMove(flag)
    }

    moveUp() {
        let flag = 0
        for (let col = 0; col < blockNum; col++) {
            for (let row = blockNum - 1; row > 0; row--) {
                let nextRow = row - 1
                while (nextRow >= 0) {
                    let num1 = this.numbers[row][col]
                    let num2 = this.numbers[nextRow][col]
                    if (num1 == 0) {
                        if (num2 != 0) {
                            this.moveBlock(nextRow, col, row, col)
                            if (flag == 0) flag = 1
                        }
                        else {
                            nextRow--
                        }
                    } else {
                        if (num2 == 0) {
                            nextRow--
                        } else if (num2 == num1) {
                            this.mergeBlock(nextRow, col, row, col)
                            flag = 2
                            break
                        } else {
                            break
                        }
                    }
                }

            }
        }
        this.afterMove(flag)
    }

    moveDown() {
        let flag = 0 //0:无变化 1:移动  2:合并
        for (let col = 0; col < blockNum; col++) {
            for (let row = 0; row < blockNum - 1; row++) {
                let nextRow = row + 1
                while (nextRow < blockNum) {
                    let num1 = this.numbers[row][col]
                    let num2 = this.numbers[nextRow][col]
                    if (num1 == 0) {
                        if (num2 != 0) {
                            this.moveBlock(nextRow, col, row, col)
                            if (flag == 0) flag = 1
                        }
                        else {
                            nextRow++
                        }
                    } else {
                        if (num2 == 0) {
                            nextRow++
                        } else if (num2 == num1) {
                            this.mergeBlock(nextRow, col, row, col)
                            flag = 2
                            break
                        } else {
                            break
                        }
                    }
                }

            }
        }
        this.afterMove(flag)

    }

    //方块移动
    moveBlock(row1, col1, row2, col2) {
        this.numbers[row2][col2] = this.numbers[row1][col1]
        this.numbers[row1][col1] = 0
        this.blocks[row2][col2] = this.blocks[row1][col1]
        this.blocks[row1][col1] = null
        //缓动（动画）
        tween(this.blocks[row2][col2]).to(MOVE_DAURATION, { position: this.positions[row2][col2] }).start()
    }

    //方块合并
    mergeBlock(row1, col1, row2, col2) {
        this.numbers[row2][col2] *= 2
        this.numbers[row1][col1] = 0
        this.blocks[row1][col1].destroy()
        this.blocks[row1][col1] = null
        this.blocks[row2][col2].getComponent(blockControl).setNumber(this.numbers[row2][col2])
        //缩放动画
        tween(this.blocks[row2][col2])
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start()
        this.updateScore(this.numbers[row2][col2])
    }

    //得分
    updateScore(num) {
        this.score += num
        if (this.score > this.best) {
            this.best = this.score
            localStorage.setItem("best", this.best + "")
        }
        this.node.getChildByName("score").getChildByName("num").getComponent(Label).string = this.score + ""
        this.node.getChildByName("best").getChildByName("num").getComponent(Label).string = this.best + ""
    }

    //滑动操作之后
    afterMove(flag) {
        //移动
        if (flag == 1) {
            this.audioSource.playOneShot(this.audioMove, 1)
        }
        else if (flag == 2) {//合并
            this.audioSource.playOneShot(this.audioMerge, 1)
        }
        if (flag > 0) {//有效滑动，产生新方块
            setTimeout(() => {
                this.randomBlock()
                if (this.checkFail()) {//游戏失败检查
                    this.gameover()
                }
            }, 500)
        }
    }

    checkFail() {
        for (let i = 0; i < blockNum; i++) {
            for (let j = 0; j < blockNum; j++) {
                let num = this.numbers[i][j]
                if (num == 0) return false
                if (i > 0 && this.numbers[i - 1][j] == num) return false
                if (i < blockNum - 1 && this.numbers[i + 1][j] == num) return false
                if (j > 0 && this.numbers[i][j - 1] == num) return false
                if (j < blockNum - 1 && this.numbers[i][j + 1] == num) return false
            }
        }
        return true
    }

    gameover() {
        let gameover = this.node.getChildByName("gameover")
        gameover.active = true
        gameover.getChildByName("end").getChildByName("score").getComponent(Label).string = this.score.toString()
        let best = localStorage.getItem("best")
        gameover.getChildByName("end").getChildByName("best").getComponent(Label).string = "历史最高：" + best
        gameover.getChildByName("restart").on(Node.EventType.TOUCH_START, () => {
            gameover.active = false
            this.init()
        }, this)
        gameover.getChildByName("rank").on(Node.EventType.TOUCH_START, () => {
            gameover.active = false
            this.node.getChildByName("rank").active = true
        }, this)
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

