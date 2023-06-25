
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    label: cc.Node = null;

    // onLoad () {}

    start () {
    }
    
    isPause:boolean=false;
    // update (dt) {}

    pause(){
        if(!this.isPause){
            cc.director.pause();
            this.isPause=true;
        }
        else{
            cc.director.resume();
            this.isPause=false;
        }
    }
}
