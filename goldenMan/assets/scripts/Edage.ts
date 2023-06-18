import RopeCtrl from "./RopeCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Edage extends cc.Component {
    @property({type:RopeCtrl, tooltip:"碰撞时候需要处理绳子"})
    rope : RopeCtrl = null;

    onCollisionEnter(other : any, self : any) {
        this.rope.backWithNothing();
    }
}
