// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    srcWidth:number
    srcHeight:number
    isSelected:boolean = false

    @property(cc.Prefab)
    bulletPre:cc.Prefab = null    //在player上，挂载此预设体
   
     //0,25   碰撞设值
    //-40,7
    //0,-30
    //40,7
    @property
    shootCd:number = 0.5 //射击间隔

    onLoad(){ 
        this.srcWidth = cc.view.getCanvasSize().width
        this.srcHeight = cc.view.getCanvasSize().height
    }

    start () {
       this.addTouchListener()
       this.schedule(()=>{
           this.shoot()
       },this.shootCd)
    }

    //射击
    shoot(){
       //射击声音
       cc.resources.load("audio/bullet",cc.AudioClip,(error,clip:cc.AudioClip)=>{
           cc.audioEngine.playEffect(clip,false)
       })

       let bullet =cc.instantiate(this.bulletPre)  
       bullet.x = this.node.x;
       bullet.y = this.node.y+this.node.height / 2;  
       bullet.setParent(cc.director.getScene())
    }

    addTouchListener(){
          this.node.on(cc.Node.EventType.TOUCH_START,()=>{
           this.isSelected = true
       })
       this.node.on(cc.Node.EventType.TOUCH_END,()=>{
          this.isSelected = false
       })
       this.node.on(cc.Node.EventType.TOUCH_MOVE,(e:cc.Event.EventTouch)=>{
           if(this.isSelected){
            this.node.setPosition(e.getLocation())   
            //判断左边界      
            //this.node.width /2 <0  宽度的一半除2 小于0 表示飞出界了
            if(this.node.x - this.node.width /2 < 0){
               this.node.x = this.node.width /2
            }
            // 判断右边界， 加上宽带的一半除2 大于宽度
            else if(this.node.x + this.node.width /2 > this.srcWidth){
                this.node.x = this.srcWidth - this.node.width /2
            }
            // 判断上边界，
            if(this.node.y + this.node.height /2  > this.srcHeight){
                this.node.y = this.srcHeight - this.node.height /2
             }
             // 判断下边界，
             else if(this.node.y -  this.node.height /2 < 0){
                 this.node.y = this.node.height /2
             }
           }
       })
    }
    // update (dt) {}
}
