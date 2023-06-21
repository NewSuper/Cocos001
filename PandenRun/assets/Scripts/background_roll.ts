const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    other: cc.Node = null;

    @property({
        min:0,
        displayName:"背景滚动速度"
    })
    speed:number=0;

    onLoad () {
        if(this.other==null ){
            cc.error('other node is null');
            this.enabled=false;
        }
    }

   

    update (dt) {
        let trigger=this.node.width;
        if(this.node.x<-trigger){
            this.node.x=this.other.x+trigger;
        }
        if(this.other.x<-trigger){
            this.other.x=this.node.x+trigger;
        }

        this.node.x-=this.speed*dt;
        this.other.x-=this.speed*dt;
    }
}
