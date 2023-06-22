
const { ccclass, property } = cc._decorator;

@ccclass
export default class Piece extends cc.Component {

    public id: boolean;
    private isBlank: boolean;

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouch,this);
    }
    
    public init(frame: cc.SpriteFrame) {
        let sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame=frame;
    }

    public set IsBlank(blank: boolean) {
        this.node.active = !blank;
        this.isBlank=blank;
    }

    public get IsBlank() {
        return this.isBlank;
    }

    onTouch(e:cc.Event.EventTouch){
        this.node.parent.emit('touch',this.node);
    }
}
