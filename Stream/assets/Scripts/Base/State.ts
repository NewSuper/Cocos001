import { AnimationClip, Sprite, SpriteFrame, animation } from "cc";
import { PlayerStateMachine } from "../Entity/Player/PlayerStateMachine";
import { ResourceManager } from "../Runtime/ResourceManager";
import { StateMachine } from "./StateMachine";
import { sortSpriteFrame } from "../Utils";

export const  ANIMATION_SPEED=1/8
// 动画状态积类
export default class State{

  animationClip:AnimationClip

  constructor(
    private fsm:StateMachine ,
    public readonly path:string,
    private mode:AnimationClip.WrapMode=AnimationClip.WrapMode.Normal,
    private events:any[]=[]
    ){
      this.init()
  }
  async init(){
    const promise=createAnimationClip(this.path,this.mode)
    this.fsm.waitinglist.push(promise)
    this.animationClip= await promise

    for(const event of this.events){
      this.animationClip.events.push(event)
    }

  }
  run(){
    this.fsm.animationComponent.defaultClip=this.animationClip
    this.fsm.animationComponent.play()
  }
}
async function createAnimationClip(path:string,mode:AnimationClip.WrapMode):Promise<AnimationClip>{
  const animationClip=new AnimationClip(path)
  const spriteFrames=await ResourceManager.Instance.loadDirSpriteFrame(path)
  const track=new animation.ObjectTrack()
  track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
  const frames:Array<[number,SpriteFrame]>=sortSpriteFrame(spriteFrames).map((item,index)=>[ANIMATION_SPEED*index,item])
  track.channel.curve.assignSorted(frames);
  animationClip.addTrack(track);



  animationClip.duration=frames.length*ANIMATION_SPEED
  animationClip.wrapMode=mode
  return animationClip
}
