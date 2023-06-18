import RopeCtrl from "./RopeCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {

    @property({type:RopeCtrl, tooltip:"控制绳子的组件"})
    rope: RopeCtrl = null;

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, function(e){
            this.rope.throwRope();
        }, this);
    }

    start () {

    }

    // update (dt) {}
}
