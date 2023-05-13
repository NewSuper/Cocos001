import { Sprite, UITransform, _decorator,Animation, Component } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKE_STATE_ENUM } from "../../../Enum";
import { EventManager } from "../../Runtime/EventManager";
import { TILE_HIGHT, TILE_WIDTH } from "../../Tile/TileManager";
import { DataManager } from "../../Runtime/DataManager";
import { IEntity, ISpikes } from "../../../Level";
import { SpikeStateMachine } from "./SpikeStateMachine";
import { StateMachine } from "../../Base/StateMachine";

const { ccclass, property } = _decorator;

@ccclass('SpikeManager')
export class SpikeManager extends Component {

  x:number=0
  y:number=0
  animationComponent:Animation
  type:ENTITY_TYPE_ENUM
  fsm:StateMachine
  id:number
  maxCount:number
  _count:number

  get count():number{
    return this._count
  }
  set count(value:number){
    this._count=value
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,value)
  }
  async init(params:ISpikes){
    this.id=1
    this.render()
    this.fsm=this.addComponent(SpikeStateMachine)
    await this.fsm.init()
    this.x=params.x
    this.y=params.y
    this.type=params.type
    this.maxCount=SPIKE_STATE_ENUM[ENTITY_TYPE_ENUM[this.type]]
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,this.maxCount)

    this.count=params.count
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.run,this)
  }
  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.run)
  }
  run(){
    const player=DataManager.Instance.player
    // todo 每次动画片段加一
    if(this.count===this.maxCount){
      this.count=0
    }else{
      this.count++
    }
    if(this.count===this.maxCount&&player.x===this.x&&player.y===this.y){
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_DEATH)
    }
  }
  protected update(dt: number): void {
    // 左下为零
    this.node.setPosition((this.x-1.5)*TILE_WIDTH,(1.5-this.y)*TILE_HIGHT)
  }
  render(){
    const sprite= this.addComponent(Sprite)
    sprite.sizeMode=Sprite.SizeMode.CUSTOM
    const transform=this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH*4,TILE_HIGHT*4)
  }
}
