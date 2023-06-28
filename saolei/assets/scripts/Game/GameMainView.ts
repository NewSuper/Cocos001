import { _decorator, Component, Node, Sprite, Vec2, TiledMap, instantiate, Prefab, SpriteFrame, Tween, ForwardPipeline, tween, math } from 'cc';
import EventID from '../Event/EventID';
import Message from '../Event/Message';
import { IMessage } from '../Event/IMessage';
import { GameMainDataManager } from './GameMainDataManager';
import { Grid } from './Grid';
import { AStar } from '../AStar/AStar';
import MathUtil from '../Util/MathUtil';
const { ccclass, property } = _decorator;

@ccclass('GameMainView')
export class GameMainView extends Component implements IMessage {

    private _mapArr: Grid[][];
    private _canUseMapArr: Vec2[];

    @property({ type: Sprite })
    public player: Sprite;

    @property({ type: TiledMap })
    public mapNode: TiledMap;

    @property({ type: Prefab })
    public prefab: Prefab;

    @property({ type: SpriteFrame })
    public notImg: SpriteFrame;
    @property({ type: SpriteFrame })
    public canImg: SpriteFrame;
    @property({ type: SpriteFrame })
    public pathImg: SpriteFrame;

    private _hasPath: boolean = false;
    private _index: number = 0;
    private _time: number = 0;
    private _x: number = 0;
    private _y: number = 0;
    private _astar: AStar;

    start() {

        Message.instance.add(EventID.TOUCH_GRID, this);

        this.createMap();

        this.initPlayer();

        this._astar = new AStar(this._mapArr);
    }

    /**
     * 创建地图
     */
    private createMap(): void {
        this._mapArr = [];
        this._canUseMapArr = [];
        var col: number = GameMainDataManager.instance.mapC;
        var row: number = GameMainDataManager.instance.mapR;
        for (var i = 0; i < col; i++) {
            this._mapArr[i] = [];
            for (var j = 0; j < row; j++) {
                var node: Node = instantiate(this.prefab);
                var grid: Grid = node.getComponent(Grid);
                grid.setIdx(i, j);
                var p: number = Math.random() * 100;
                var isObstacle: boolean = false;
                if (p < 30) {
                    isObstacle = true;
                } else {
                    isObstacle = false;
                }
                grid.setImg(isObstacle, isObstacle ? this.notImg : this.canImg);
                this._mapArr[i][j] = grid;
                node.parent = this.mapNode.node;
                if (!grid.isObstacle) {
                    this._canUseMapArr.push(new Vec2(i, j));
                }
            }
        }
    }

    /**
     * 初始化玩家坐标
     */
    private initPlayer(): void {
        this.player.node.parent = this.mapNode.node;
        var pos: Vec2 = this._canUseMapArr[Math.floor(Math.random() * this._canUseMapArr.length)];
        var position: Vec2 = this.idxToPosition(pos.x, pos.y);
        this.player.node.setPosition(position.x, position.y);
    }

    /**
     * 坐标转换成地图索引
     * @param x 
     * @param y 
     */
    private positionToIdx(x: number, y: number): Vec2 {
        var pos: Vec2 = GameMainDataManager.instance.mapStartPos;
        var index: Vec2 = new Vec2(
            Math.floor((y - pos.y) / (GameMainDataManager.instance.mapWidth + GameMainDataManager.instance.mapOffsetX)),
            Math.floor((x - pos.x) / (GameMainDataManager.instance.mapHeight + GameMainDataManager.instance.mapOffsetY))
        )
        return index;
    }

    /**
     * 地图索引转换成坐标
     * @param x 
     * @param y 
     * @returns 
     */
    private idxToPosition(x: number, y: number): Vec2 {
        var pos: Vec2 = GameMainDataManager.instance.mapStartPos;
        var index: Vec2 = new Vec2(
            pos.x + (y * (GameMainDataManager.instance.mapWidth + GameMainDataManager.instance.mapOffsetX)),
            pos.y + (x * (GameMainDataManager.instance.mapHeight + GameMainDataManager.instance.mapOffsetY)));
        return index;
    }

    recvMsg(cmd: EventID, data: any): void {
        switch (cmd) {
            case EventID.TOUCH_GRID:
                this.touchHandler(data);
                break;
        }
    }

    private touchHandler(e: Grid): void {
        this.reset();

        var grid: Grid = e;

        var playerPos: math.Vec3 = this.player.node.getPosition();
        var playerIdx: Vec2 = this.positionToIdx(playerPos.x, playerPos.y);
        var playerGrid: Grid = this._mapArr[playerIdx.x][playerIdx.y];

        this._astar.find(playerGrid.i, playerGrid.j, grid.i, grid.j);
        if (this._astar.path.length == 0) {
            console.log("No Path");
            return;
        }
        for (var i of this._astar.path) {
            this._mapArr[i.x][i.y].setImg(false, this.pathImg);
        }
    }

    private reset(): void {
        tween(this.player).stop();
        clearInterval(this._time);
        this._index = 0;
        for (var i of this._canUseMapArr) {
            this._mapArr[i.x][i.y].setImg(false, this.canImg);
        }
    }

    update(deltaTime: number) {
        if (this._index >= this._astar.path.length || this._astar.path.length == 0) return;

        var i: number = this._astar.path[this._index].x;
        var j: number = this._astar.path[this._index].y;
        var tarPos: Vec2 = this.idxToPosition(i, j)
        var playerPos: Vec2 = new Vec2(this.player.node.getPosition().x, this.player.node.getPosition().y);
        var dis: number = MathUtil.getDistanceByPoint(playerPos, tarPos);
        if (Math.abs(dis) >= 5) {
            var angle: number = MathUtil.getDeg2(playerPos.x, playerPos.y, tarPos.x, tarPos.y);
            var rotation: number = MathUtil.degToRad(angle);
            var speedX: number = Math.cos(rotation);
            var speedY: number = Math.sin(rotation);
            var nX: number = Math.floor(speedX * 5 + playerPos.x);
            var nY: number = Math.floor(speedY * 5 + playerPos.y);
            this.player.node.setPosition(nX, nY);
        } else {
            this.player.node.setPosition(tarPos.x, tarPos.y);
            this._index++;
        }
    }
}

