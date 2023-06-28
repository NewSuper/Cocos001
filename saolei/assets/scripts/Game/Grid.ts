import { _decorator, Component, Node, Vec2, UITransform, SpringJoint2D, Sprite, Color, EventTouch, Touch, Event, SpriteFrame, Label, LayerItem } from 'cc';
import EventID from '../Event/EventID';
import Message from '../Event/Message';
import { GameMainDataManager } from './GameMainDataManager';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export class Grid extends Component {

    private _idx: Vec2 = new Vec2();

    private _uiInfo: UITransform;

    private _img: Sprite;

    @property({ type: Label })
    public txt: Label;
    @property({ type: Label })
    public posTxt: Label;
    private _url: SpriteFrame;

    // 是否是障碍物
    private _isObstacle: boolean;

    onLoad(): void {
        this._uiInfo = this.getComponent(UITransform);
        this._uiInfo.setContentSize(GameMainDataManager.instance.mapWidth, GameMainDataManager.instance.mapHeight);

        this._img = this.getComponent(Sprite);
    }

    start(): void {
        this._img.spriteFrame = this._url;
        this.node.on(Node.EventType.TOUCH_START, this.touchHandler, this);

        this.txt.string = ""//(this._idx.x + ", " + this._idx.y);
        var pos = this.node.getPosition();
        this.posTxt.string = ""//(pos.x + ", " + pos.y);
    }

    public setImg(isObstacle: boolean, value: SpriteFrame): void {
        this._isObstacle = isObstacle;
        this._url = value;
        if (this._img) {
            this._img.spriteFrame = this._url;
        }
    }

    public setIdx(i: number, j: number): void {
        this._idx.set(i, j);
        var mapPos: Vec2 = GameMainDataManager.instance.mapStartPos;
        var x: number = mapPos.x + (j * (GameMainDataManager.instance.mapWidth + GameMainDataManager.instance.mapOffsetX));
        var y: number = mapPos.y + (i * (GameMainDataManager.instance.mapHeight + GameMainDataManager.instance.mapOffsetY));
        this.node.setPosition(x, y);
    }


    private touchHandler(): void {
        if (this._isObstacle) { return; }
        Message.instance.send(EventID.TOUCH_GRID, this);
    }

    public get isObstacle(): boolean { return this._isObstacle; }

    public get idx(): Vec2 { return this._idx; }

    public get i(): number {
        return this._idx.x;
    }
    public get j(): number {
        return this._idx.y;
    }
}

