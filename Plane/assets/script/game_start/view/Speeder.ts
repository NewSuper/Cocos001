
const {ccclass, property} = cc._decorator;

@ccclass
export default class Speeder extends cc.Component {
 @property
    speed:cc.Vec3=cc.v3();

    update (dt:number) {
        let v=this.node.position.add(this.speed.mul(dt));
        this.node.position=v;
    }
}
