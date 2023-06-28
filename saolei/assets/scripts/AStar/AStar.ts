/**
 * 寻路
 * Created By WangZhiHao
 */
import { _decorator, Component, Node } from 'cc';
import { GameMainDataManager } from '../Game/GameMainDataManager';
import { Grid } from '../Game/Grid';
import { AStarNode } from './AStarNode';
const { ccclass, property } = _decorator;

@ccclass('AStar')
export class AStar {
    private _mapArr: Grid[][] = [];
    private _nodeArr: AStarNode[][] = [];

    private _openArr: Array<AStarNode>;
    private _currentVersion: number = 0;

    private _startNode: AStarNode;
    private _endNode: AStarNode;
    private _path: Array<AStarNode>;

    public constructor(mapArr: Grid[][]) {
        this._mapArr = mapArr;
        this._openArr = new Array<AStarNode>();
        this._path = new Array<AStarNode>();

        for (var i: number = 0; i < mapArr.length; i++) {
            this._nodeArr[i] = [];
            for (var j: number = 0; j < mapArr[i].length; j++) {
                this._nodeArr[i][j] = new AStarNode(i, j, true);
                this._nodeArr[i][j].moveable = !mapArr[i][j].isObstacle;
            }
        }

    }
    /**
     * 重置数据
     */
    private reset(): void {
        this._startNode = null;
        this._endNode = null;
        this._path.length = 0;
        for (var i = 0; i < this._mapArr.length; i++) {
            for (var j = 0; j < this._mapArr[i].length; j++) {
                // this._nodeArr[i][j].reset();
                this._nodeArr[i][j].moveable = !this._mapArr[i][j].isObstacle;
            }
        }
    }

    public get path(): AStarNode[] { return this._path; }
    /**
     * 寻路
     * @param startX 开始x坐标(二维数组下标i) 行
     * @param startY 开始y坐标(二维数组下标j) 列
     * @param endX 终点x坐标(二维数组下标i) 行
     * @param endY 终点x坐标(二维数组下标i) 行
     */
    public find(startX: number, startY: number, endX: number, endY: number): Array<AStarNode> {
        var c: number = GameMainDataManager.instance.mapC;//地图最大行
        var r: number = GameMainDataManager.instance.mapR;//地图最大列
        if (startX < 0 || startY < 0 || startX >= c || startY >= r ||
            endX < 0 || endY < 0 || endX >= c || endY >= r) {
            console.error("No Path");
            return null;
        }

        this.reset();

        this._startNode = this._nodeArr[startX][startY];//起点node
        this._endNode = this._nodeArr[endX][endY];//终点node

        if (this.findPath()) {//开始寻路
            return this._path;
        }

        console.error("No Path");
        return null;
    }

    private findPath(): boolean {
        this._openArr.length = 0;
        this._currentVersion++;

        //初始化起点数据g h f
        this._startNode.g = 0;
        this._startNode.h = this.getH(this._startNode, this._endNode);
        this._startNode.f = this._startNode.g + this._startNode.f;
        return this.search();
    }
    /**
     * 查找路径
     */
    private search(): boolean {

        if (!this._endNode.moveable) { return false; }

        var c: number = GameMainDataManager.instance.mapC;
        var r: number = GameMainDataManager.instance.mapR;

        var node: AStarNode = this._startNode;
        node.version = this._currentVersion;
        //广度遍历
        while (node != this._endNode) {
            var sx: number = node.x - 1;
            if (sx < 0) {
                sx = 0;
            }
            var sy: number = node.y - 1;
            if (sy < 0) {
                sy = 0;
            }
            var ex: number = node.x + 1;
            if (ex >= c) {
                ex = c - 1;
            }
            var ey: number = node.y + 1;
            if (ey >= r) {
                ey = r - 1;
            }
            for (var i = sx; i <= ex; i++) {
                for (var j = sy; j <= ey; j++) {
                    var tempNode: AStarNode = this._nodeArr[i][j];
                    if (tempNode == node || tempNode.moveable == false) {
                        continue;
                    }
                    //是否为四方向(如果只能四方向走打开注释(3 * 3对角公式))
                    // if (Math.abs(node.x - i) + Math.abs(node.y - j) == 2) {
                    // 	continue;
                    // }

                    var g: number = node.g + 1;
                    var h: number = this.getH(tempNode, this._endNode);
                    var f: number = g + h;
                    if (tempNode.version == this._currentVersion) {//版本比较
                        if (tempNode.f > f) {
                            tempNode.f = f;
                            tempNode.g = g;
                            tempNode.h = h;
                            tempNode.parent = node;
                        }
                    } else {
                        tempNode.f = f;
                        tempNode.g = g;
                        tempNode.h = h;
                        tempNode.parent = node;
                        tempNode.version = this._currentVersion;//更新版本
                        this._openArr.push(tempNode);
                    }
                }
            }
            if (this._openArr.length == 0) {
                return false;
            }
            //取出f值最小的点
            var item: AStarNode = this.getMinF();
            node = item;

        }
        this.buildPath();
        return true;
    }
    /**
     * 获取开放列表里f值最小的节点
     */
    private getMinF(): AStarNode {
        var pos: number = 0;
        var item: AStarNode = this._openArr[0];
        for (var k: number = 1; k < this._openArr.length; k++) {
            if (this._openArr[k].f < item.f) {
                item = this._openArr[k];
                pos = k;
            }
        }
        this._openArr.splice(pos, 1);
        return item;
    }

    /**
     * 生成路径
     */
    private buildPath(): void {
        var node: AStarNode = this._endNode;
        this._path.length = 0;
        this._path.push(node);
        while (node != this._startNode) {
            node = node.parent;
            this._path.unshift(node);
        }
    }

    private getH(startNode: AStarNode, endNode: AStarNode): number {
        var x: number = startNode.x - endNode.x;
        var y: number = startNode.y - endNode.y;
        return x * x + y * y;
    }
}

