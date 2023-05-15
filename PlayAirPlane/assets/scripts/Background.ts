// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Background extends cc.Component {

    srcWidth:number
    srcHeight:number

    bgs:cc.Node[]
    
    @property
    speed:number = 50

    @property(cc.Prefab)
    enemyPre:cc.Prefab = null

    score:number = 0  

    onLoad(){ 
        this.srcWidth = cc.view.getCanvasSize().width
        this.srcHeight = cc.view.getCanvasSize().height
        this.bgs = this.node.children

        cc.director.getCollisionManager().enabled = true
    }

    start () {
      this.schedule(()=>{
        let enemy = cc.instantiate(this.enemyPre)
        enemy.setParent(cc.director.getScene())
      },1)
    }

     update (dt:number) {
        // for(let bg of this.bgs){
        //   bg.y -= this.speed*dt
        //   if(bg.y < -this.srcHeight){
        //     bg.y = this.srcHeight
        //   }
        // }

        this.bgs[0].y -= this.speed * dt
        this.bgs[1].y -= this.speed * dt

        if(this.bgs[0].y < - this.srcHeight){
            this.bgs[0].y = this.bgs[1].y + this.bgs[1].height
        } 
        if(this.bgs[1].y >　-this.srcHeight){
           this.bgs[1].y = this.bgs[0].y+ this.bgs[0].height
        }
     }
}
