// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Background from "./Background";
import Bullet from "./Bullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
 
    //0,-22   碰撞设值
    //30,-8
    //0,26
    //-30,-8

    srcWidth:number
    srcHeight:number
    
    @property
    speed:number = 100;

    frameId:number = 0

    isDead:boolean = false

    onLoad(){ 
        this.srcWidth = cc.view.getCanvasSize().width
        this.srcHeight = cc.view.getCanvasSize().height
    }

    start() { 
      this.node.y =  this.srcHeight + this.node.height
      this.node.x = Math.random() * (this.srcWidth - this.node.width) 
         + this.node.width / 2
    }

    update(dt) { 
        this.node.y -= this.speed * dt
        //飞出界
        if(this.node.y - this.node.height / 2 < 0){
           this.node.removeFromParent(true)
           this.destroy()
        }
    }
    
    //碰撞回调函数方法，不能写错，否则不会回调
    onCollisionEnter(other:cc.Collider){
        //子弹tag 为9  。碰到就等于死亡
        if(other.tag == 9  && !this.isDead){

          cc.find("Background").getComponent(Background).score++;

          cc.find("lblScore").getComponent(cc.Label).string ="分数："
            + cc.find("Background").getComponent(Background).score;

            this.die()  //打中就死亡

            other.getComponent(Bullet).bulletDie()//打中。子弹也销毁
        
        }else if(other.tag == 0 && !this.isDead){
            //游戏结束
            alert("Game Over")
            //cc.audioEngine.stopAll()  无效
            cc.audioEngine.stopMusic()
            cc.game.pause()
        }
    }

    //死亡
    die(){ 
       this.isDead = true

        //播放音乐
       cc.resources.load("audio/boom",cc.AudioClip,(error,clip:cc.AudioClip)=>{
          cc.audioEngine.playEffect(clip,false)
       })
       //帧动画的爆炸特效
       this.schedule(()=>{
           cc.resources.load(`images/explosion${this.frameId}`,cc.SpriteFrame,(error,sf:cc.SpriteFrame)=>{
                this.getComponent(cc.Sprite).spriteFrame = sf;
                this.frameId++
           })
       },0.05,19,0)
    }
}
