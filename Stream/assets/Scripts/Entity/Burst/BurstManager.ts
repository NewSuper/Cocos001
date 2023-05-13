import { Sprite, UITransform, _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../../Enum";
import { EventManager } from "../../Runtime/EventManager";
import { TILE_HIGHT, TILE_WIDTH } from "../../Tile/TileManager";
import { DataManager } from "../../Runtime/DataManager";
import { IEntity } from "../../../Level";
import { BurstStateMachine } from "./BurstStateMachine";



const { ccclass, property } = _decorator;



@ccclass('BurstManager')
export class BurstManager extends EntityManager {
  async init(params:IEntity){
    this.id=1
    this.render()
    this.fsm=this.addComponent(BurstStateMachine)
    await this.fsm.init()
    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.run,this)
  }
  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.run)
  }
  run(){
    //玩家站在方格上
    if(this.state===ENTITY_STATE_ENUM.IDLE){
      if(DataManager.Instance.player.x===this.x&&DataManager.Instance.player.y===this.y){
        this.state=ENTITY_STATE_ENUM.ATTACK
      }
    }else if(this.state===ENTITY_STATE_ENUM.ATTACK){
      this.state=ENTITY_STATE_ENUM.DEATH
    }
    if(this.state===ENTITY_STATE_ENUM.DEATH){
      if(DataManager.Instance.player.x===this.x&&DataManager.Instance.player.y===this.y){
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_AIRDEATH)
      }
    }
  }
  protected update(dt: number): void {
    // 左下为零
    this.node.setPosition((this.x)*TILE_WIDTH,(-this.y)*TILE_HIGHT)
}
  render(){
    const sprite= this.addComponent(Sprite)
    sprite.sizeMode=Sprite.SizeMode.CUSTOM
    const transform=this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH,TILE_HIGHT)
  }
}
