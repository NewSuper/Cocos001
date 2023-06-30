const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    maxY:number=700;

    @property
    minY:number=300;

    isScore:boolean=false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('init',this.init,this);
    }



    update (dt) {
        let up=this.node.getChildByName('up');
        //如果水管小于屏幕宽度,就自己销毁
        if(up.x<-cc.winSize.width){
            this.node.destroy();
            cc.log('水管被销毁了 '+ this.node.uuid);
        }
    }

    init(){
        let x=cc.winSize.width/3;
        let y=Math.random()*(this.maxY-this.minY)+this.minY;    //设置随机数的范围minY~maxY

        let up=this.node.getChildByName('up');
        up.y+=y;
        up.x=x;
        let down=this.node.getChildByName('down');
        down.y+=y;
        down.x=x;

        let tag=this.node.getChildByName('tag');
        tag.y+=y;
        tag.x=x;
    }
}
