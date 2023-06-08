const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {  
    @property
    rotate: number =0;

    update (dt) {
        this.node.angle+=this.rotate*dt;
    }
}
