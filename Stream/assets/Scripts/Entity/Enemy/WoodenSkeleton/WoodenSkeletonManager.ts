import { Sprite, UITransform, _decorator } from "cc";
import { EntityManager } from "../../../Base/EntityManager";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../../../Enum";
import { EventManager } from "../../../Runtime/EventManager";
import { DataManager } from "../../../Runtime/DataManager";
import { TILE_HIGHT, TILE_WIDTH } from "../../../Tile/TileManager";
import { IEntity } from "../../../../Level";
import { EnemyManager } from "../EnemyManager";


const { ccclass, property } = _decorator;



@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  async init(params:IEntity){
    this.render()

    this.fsm=this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()

    super.init(params)
  }

  Attack(){

    const {targetX:x,targetY:y}=DataManager.Instance.player
    if(Math.abs(x-this.x)+Math.abs(y-this.y)<=1){
      //攻击玩家
      this.state=ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_DEATH)
    }
  }

}
