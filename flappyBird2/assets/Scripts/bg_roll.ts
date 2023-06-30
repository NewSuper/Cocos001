const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    other:cc.Node=null;

    @property({
        min:0,
        displayName:"scroll speed"
    })
    speed:number=100;

    
    onLoad () {   
        if(this.other==null){
            cc.error('other node is null');
        }
        this.other.x=this.node.width;
    }


    update (dt) {

        let trigger=this.node.width;

        //背景移动到屏幕末尾之后循环
        if(this.node.x<-trigger){
            this.node.x=this.other.x+trigger;
        }
        if(this.other.x<-trigger){
            this.other.x=this.node.x+trigger;
        }

        //背景移动
        this.node.x-=this.speed*dt;
        this.other.x-=this.speed*dt;
    }
}
