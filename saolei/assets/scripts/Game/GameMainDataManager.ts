import { _decorator, Component, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameMainDataManager')
export class GameMainDataManager extends Component {

    private static _instance: GameMainDataManager;

    public static get instance(): GameMainDataManager {
        if (!this._instance) {
            this._instance = new GameMainDataManager();
        }
        return this._instance;
    }

    public readonly mapC: number = 12;// 行
    public readonly mapR: number = 12;// 列

    public readonly mapWidth: number = 40;// 格子宽度
    public readonly mapHeight: number = 40;// 格子高度
    public readonly mapOffsetX: number = 5;// x的偏移量
    public readonly mapOffsetY: number = 5;// y的偏移量

    public readonly mapStartPos: Vec2 = new Vec2(200, 100);// 地图起点坐标


}

