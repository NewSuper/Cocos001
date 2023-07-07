import HanioView from "../view/HanioView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.Color])
    colorList: cc.Color[] = [];

    tempPos: cc.Vec3 = cc.v3(0, 0);

    hanio: cc.Node = null;

    isCanMove: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('init', this.init, this);
        this.node.on('setNode', this.setNode, this);
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchCancel, this);
    }

    setNode(hanio: cc.Node) {
        this.hanio = hanio;
    }

    // update (dt) {}

    init(n: number) {
        this.node.color = this.colorList[n];                //设置砖块颜色
    }

    touchStart(e: cc.Event.EventTouch) {
        this.tempPos = this.node.position;
        let comp = this.hanio.getComponent(HanioView);
        let index = comp.checkBlock(this.node.position);
        if (comp.hanioModel.getLast(index) != this.node.width) {
            return;
        }
        this.isCanMove = true;
        this.node.opacity = 200;
    }

    touchMove(e: cc.Event.EventTouch) {
        if (!this.isCanMove) {
            return
        }
        let detal = cc.v3(e.getDelta()).add(this.node.position);
        this.node.position = detal;
    }

    touchCancel(e: cc.Event.EventTouch) {
        let comp = this.hanio.getComponent(HanioView);
        if (!comp.placeBlock(this.tempPos, this.node)) {
            //失败则回到原来的位置
            this.node.position = this.tempPos;
        }
        this.node.opacity = 255;
        this.isCanMove = false;

       
    }

}
