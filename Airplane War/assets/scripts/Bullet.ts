// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    srcWidth:number
    srcHeight:number
    
    @property
    speed:number =100;

    onLoad(){ 
        this.srcWidth = cc.view.getCanvasSize().width
        this.srcHeight = cc.view.getCanvasSize().height
    }

    //子弹要加上碰撞体、预设体
    update (dt:number) {
        this.node.y += this.speed * dt  //  每秒移动
        //如果飞出界
        if(this.node.y + this.node.height > this.srcHeight){
            this.node.removeFromParent(true)
            this.destroy()
        }   
    }
    
    //子弹销毁
    bulletDie() { 
        this.node.removeFromParent(true)
        this.destroy()
    }

}
