const {ccclass, property} = cc._decorator;

@ccclass
export default class LetterCtrl extends cc.Component {

    @property({type:cc.Float, tooltip:"重力加速度"})
    g : number = 9;

    public isDroping : boolean = true;

    private vy : number = 0;

    public index : number = 0;
    public info : string = "A";
    // onLoad () {}

    start () {

    }

    update (dt) {
        if(this.isDroping === false){
            return;
        }
        this.vy -= this.g * dt/2;
        this.node.y += this.vy * dt;
    }
}
