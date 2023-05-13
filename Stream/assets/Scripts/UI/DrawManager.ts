import { _decorator, BlockInputEvents, Color, Component, Event, game, Graphics, Node,UITransform,view } from 'cc';

const { ccclass, property } = _decorator;

enum FADE_STATE_ENUM{
  IDLE='IDLE',
  FADE_IN='FADE_IN',
  FADE_OUT='FADE_OUT'
}
const DEFAULT_DURATION=200
const SCRENN_WIDTH=view.getVisibleSize().width
const SCRENN_HEIGH=view.getVisibleSize().height
@ccclass('DrawManager')
export class DrawManager extends Component {
private ctx:Graphics
private oldtime:number
private duration:number
private state:FADE_STATE_ENUM
private block:BlockInputEvents
private fadeResolve:(value:PromiseLike<null>)=>void
  init(){
    this.block=this.addComponent(BlockInputEvents)
    this.ctx=this.addComponent(Graphics)
    const transform=this.getComponent(UITransform)
    transform.setAnchorPoint(0.5,0.5)
    transform.setContentSize(SCRENN_WIDTH,SCRENN_HEIGH)
    this.setAlpha(1)
  }
  setAlpha(percent:number){
    this.ctx.clear()
    this.ctx.rect(0,0,SCRENN_WIDTH,SCRENN_HEIGH)
    this.ctx.fillColor=new Color(0,0,0,255*percent)
    this.ctx.fill()
    this.block.enabled=percent===1
  }
  update(): void {
      const percent=(game.totalTime-this.oldtime)/this.duration
      switch(this.state){
        case FADE_STATE_ENUM.IDLE:
          break
        case FADE_STATE_ENUM.FADE_IN:
          if(percent<1){
            this.setAlpha(percent)
          }else{
            this.setAlpha(1)
            this.state=FADE_STATE_ENUM.IDLE
            this.fadeResolve(null)
          }
          break
        case FADE_STATE_ENUM.FADE_OUT:
          if(percent<1){
            this.setAlpha(1-percent)
          }else{
            this.setAlpha(0)
            this.state=FADE_STATE_ENUM.IDLE
            this.fadeResolve(null)
          }
          break




      }
  }
  fadeIn(duration:number=DEFAULT_DURATION){
    this.setAlpha(0)
    this.duration=duration
    this.state=FADE_STATE_ENUM.FADE_IN
    this.oldtime=game.totalTime
    return new Promise(resolve=>{
      this.fadeResolve=resolve
    })
  }
  fadeOut(duration:number=DEFAULT_DURATION){
    this.setAlpha(1)
    this.duration=duration
    this.state=FADE_STATE_ENUM.FADE_OUT
    this.oldtime=game.totalTime
    return new Promise(resolve=>{
      this.fadeResolve=resolve
    })

  }
  mask(){
    this.setAlpha(1)
    return new Promise(resolve=>{
      setTimeout(resolve,DEFAULT_DURATION)
      // this.fadeResolve=resolve
    })
  }
}
