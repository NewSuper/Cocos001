const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.Component.EventHandler)
    handle: cc.Component.EventHandler = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('apart', this.apart, this);
    }

    start() {

    }

    // update (dt) {}

    apart() {
        //启用事件
        this.handle.emit([]);
    }

    startGame(){
        this.scheduleOnce(()=>{
            cc.director.loadScene('game');
        },1)
       
    }

    overGame(){
        this.scheduleOnce(()=>{
            cc.game.end();
        },1)
    }
}
