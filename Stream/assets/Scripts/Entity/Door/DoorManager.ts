import { Sprite, UITransform, _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { doorStateMachine } from "./DoorStateMachine";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../../Enum";
import { EventManager } from "../../Runtime/EventManager";
import { TILE_HIGHT, TILE_WIDTH } from "../../Tile/TileManager";
import { DataManager } from "../../Runtime/DataManager";
import { IEntity } from "../../../Level";



const { ccclass, property } = _decorator;



@ccclass('DoorManager')
export class DoorManager extends EntityManager {
  async init(params:IEntity){
    this.render()
    this.fsm=this.addComponent(doorStateMachine)
    await this.fsm.init()
    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.CHECKDOOR,this.onCheck,this)
  }
  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.CHECKDOOR,this.onCheck)
  }
  onCheck(){
    //如果所有的敌人都是死亡状态，那么可以开门
    for (const enemy of DataManager.Instance.enemies) {
      if(enemy.state!==ENTITY_STATE_ENUM.DEATH){
        //有角色存活
        console.log(enemy.state)
        return
      }
    }
    console.log("所有敌人都死亡")
    //没有角色存活
    this.state=ENTITY_STATE_ENUM.DEATH
  }

  render(){
    const sprite= this.addComponent(Sprite)
    sprite.sizeMode=Sprite.SizeMode.CUSTOM
    const transform=this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH*4,TILE_HIGHT*4)
  }
}
