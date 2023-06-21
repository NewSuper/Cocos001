
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Component.EventHandler)
    handle: cc.Component.EventHandler = null;

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
    }

    start () {

    }

    touchStart(ev:cc.Event.EventTouch){
        this.handle.emit([ev]);
    }

    // update (dt) {}
}
