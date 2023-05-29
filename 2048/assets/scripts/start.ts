//基本上和game.ts差不多，本打算通过场景判断调用不同函数，但获取场景名为空，不知道缘由，干脆直接复制了

import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, view, UITransform, Label, EventTouch, tween, AudioClip, AudioSource, resources, director } from 'cc';
import { blockControl } from './blockControl';
const { ccclass, property } = _decorator;
const blockNum = 4
var blockSize = 162.5
const gap = 10
const MOVE_DAURATION = 0.2

@ccclass('start')
export class start extends Component {

    @property(Prefab)
    private blockPrefab: Prefab = null
    @property(AudioClip)
    public audioMove: AudioClip = null
    @property(AudioClip)
    public audioMerge: AudioClip = null
    @property(AudioSource)
    public audioSource: AudioSource = null

    private positions: Vec3[][] = [[], [], [], []]   // 各个块的位置
    private numbers: number[][] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]   //各个块里的数字
    private blocks: Node[][] = [[], [], [], []] // 已有的块

    start() {
        this.autoMove()
        this.node.getChildByName("start").on(Node.EventType.TOUCH_START, (e: TouchEvent) => {
            this.unscheduleAllCallbacks()
            director.loadScene("game")
        }, this)
    }
    onLoad() {
        //初始化音频资源
        this.audioSource = this.node.getComponent(AudioSource)
        let screenWidth = 360//view.getDesignResolutionSize().width
        blockSize = (screenWidth - gap * (blockNum + 1)) / blockNum
        this.init()
    }

    init() {
        this.positions = [[], [], [], []]
        this.blocks = [[], [], [], []]
        this.numbers = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        this.initBlocks()
        this.randomBlock()
        this.randomBlock()
    }

    initBlocks() {
        let x = gap + blockSize / 2
        let y = gap + blockSize / 2
        for (let row = 0; row < blockNum; row++) {
            for (let col = 0; col < blockNum; col++) {
                let block = instantiate(this.blockPrefab)
                block.getComponent(UITransform).width = blockSize
                block.getComponent(UITransform).height = blockSize
                let bg = block.getChildByName("bg")
                bg.getComponent(UITransform).width = blockSize
                bg.getComponent(UITransform).height = blockSize
                this.node.getChildByName("square").addChild(block)
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

    randomBlock() {
        let positions = this.getEmptyPositions()
        if (positions.length == 0) {
            this.init()
        } else {
            let position = positions[Math.floor(Math.random() * positions.length)]
            let row = position.row
            let col = position.col
            let num = (Math.floor(Math.random() * 2) + 1) * 2
            this.numbers[row][col] = num
            let block = instantiate(this.blockPrefab)
            block.getComponent(UITransform).width = blockSize
            block.getComponent(UITransform).height = blockSize
            let bg = block.getChildByName("bg")
            bg.getComponent(UITransform).width = blockSize
            bg.getComponent(UITransform).height = blockSize
            this.node.getChildByName("square").addChild(block)
            this.blocks[row][col] = block
            block.setPosition(this.positions[row][col])
            block.getComponent(blockControl).setNumber(num)
            return true
        }
    }

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

    autoMove() {
        let i = 0
        this.schedule(() => {
            if (i == 0) this.moveDown()
            else if (i == 1) this.moveRight()
            else if (i == 2) this.moveUp()
            else if (i == 3) this.moveLeft()
            i++
            if (i == 4) i = 0
        }, 1, 1000, 0)
    }

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
        //console.log(this.numbers, this.positions, this.blocks)
        let flag = 0
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

    moveBlock(row1, col1, row2, col2) {
        //console.log(row1, col1, row2, col2)
        this.numbers[row2][col2] = this.numbers[row1][col1]
        this.numbers[row1][col1] = 0
        this.blocks[row2][col2] = this.blocks[row1][col1]
        this.blocks[row1][col1] = null
        tween(this.blocks[row2][col2]).to(MOVE_DAURATION, { position: this.positions[row2][col2] }).start()
    }

    mergeBlock(row1, col1, row2, col2) {
        //console.log(row1, col1, row2, col2)
        this.numbers[row2][col2] *= 2
        this.numbers[row1][col1] = 0
        this.blocks[row1][col1].destroy()
        this.blocks[row1][col1] = null
        this.blocks[row2][col2].getComponent(blockControl).setNumber(this.numbers[row2][col2])
        tween(this.blocks[row2][col2])
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start()
    }

    afterMove(flag) {

        if (flag == 1) {
            this.audioSource.playOneShot(this.audioMove, 1)
        }
        else if (flag == 2) {
            this.audioSource.playOneShot(this.audioMerge, 1)
        }
        setTimeout(() => {
            this.randomBlock()
        }, 500)

    }



    // update (deltaTime: number) {
    //     // [4]
    // }
}

