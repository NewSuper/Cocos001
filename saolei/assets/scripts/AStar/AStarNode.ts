/**
 * 节点
 * Created By WangZhiHao
 */
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AStarNode')
export class AStarNode {
    public x: number = 0;
    public y: number = 0;

    public f: number = 0;
    public g: number = 0;//起点到当前点的代价
    public h: number = 0;//这个点到终点的代价

    public moveable: boolean = false;//是否可移动

    public parent: AStarNode;
    public version: number = 0;

    public constructor(x: number, y: number, moveable: boolean) {
        this.x = x;
        this.y = y;
        this.moveable = moveable;
    }
    /**
	 * 重置
	 */
	public reset(): void {
		this.x = 0;
		this.y = 0;
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.moveable = false;
		this.parent = null;
		this.version = 0;
	}
}

