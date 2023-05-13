import { Sprite, UITransform, _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../../Enum";
import { EventManager } from "../../Runtime/EventManager";
import { TILE_HIGHT, TILE_WIDTH } from "../../Tile/TileManager";
import { DataManager } from "../../Runtime/DataManager";
import { IEntity } from "../../../Level";
import { SmokeStateMachine } from "./SmokeStateMachine";



const { ccclass, property } = _decorator;



@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  async init(params:IEntity){
    this.render()
    this.fsm=this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)
  }
  protected onDestroy(): void {
  }
  render(){
    const sprite= this.addComponent(Sprite)
    sprite.sizeMode=Sprite.SizeMode.CUSTOM
    const transform=this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH*4,TILE_HIGHT*4)
  }
}
