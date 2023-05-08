// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tank extends cc.Component {
    @property
    speed:number = 10

    cannon:cc.Node  //炮管角度
 
    bulletPos:cc.Node  //子弹预设体

    @property(cc.Prefab)
    bulletPre : cc.Prefab = null
    
    reloading:boolean = false
    @property
    reloadTime:number = 1; //秒

    onLoad() { 
        this.cannon = this.node.getChildByName("cannon")
        this.bulletPos = this.cannon.getChildByName("bulletPos")
    }

    start () {
     cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,(e:cc.Event.EventKeyboard)=>{
        switch(e.keyCode){
            case cc.macro.KEY.w:
              this.node.angle = 0
              this.node.y += this.speed
            break
            case cc.macro.KEY.s:
                this.node.angle = 180
                this.node.y -= this.speed
              break
            case cc.macro.KEY.a:
                this.node.angle = 90
                this.node.x -= this.speed
              break
            case cc.macro.KEY.d:
                this.node.angle = -90
                this.node.x += this.speed
              break
            case cc.macro.KEY.q:
                this.cannon.angle += 5
              break
            case cc.macro.KEY.e:
                this.cannon.angle -= 5  //反转5度
              break
            case cc.macro.KEY.j:
                this.fire()
            
        }
        if(this.cannon.angle == 360 || this.cannon.angle == -360){
            this.cannon.angle = 0
        }
     })
    }

    fire() { 
     if(!this.reloading){
        // cc.resources.load("audio/fire",cc.AudioClip,(error,clip)=>{
        //     cc.audioEngine.playEffect(clip,false)
        // })
        //单发子弹
        // let bullet = cc.instantiate(this.bulletPre)
        // bullet.setPosition(this.bulletPos.convertToWorldSpaceAR(cc.Vec2.ZERO))  //这个是绝对坐标0，0
        // bullet.angle = this.node.angle + this.cannon.angle;  //保证角度一致
        // bullet.setParent(cc.director.getScene())
        //多发子弹
        let bullets : cc.Node[] = [
            cc.instantiate(this.bulletPre),
            cc.instantiate(this.bulletPre),
            cc.instantiate(this.bulletPre)
        ]
        for(let i =0;i<bullets.length;i++){
            bullets[i].angle = this.node.angle + this.cannon.angle + 30 - i * 30
            bullets[i].setPosition(this.bulletPos.convertToWorldSpaceAR(cc.Vec2.ZERO))
            bullets[i].setParent(cc.director.getScene())
        }


       this.reloading = true //表示正在装子弹
        setTimeout(()=>{
            this.reloading = false
        },50)
      // this.schedule(()=>{  this.reloading = false},this.reloadTime * 1000)
       }

    }

    // update (dt) {}
}
