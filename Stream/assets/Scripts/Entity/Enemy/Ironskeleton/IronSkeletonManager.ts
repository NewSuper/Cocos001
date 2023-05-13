import { Sprite, UITransform, _decorator } from "cc";
import { IEntity } from "../../../../Level";
import { EnemyManager } from "../EnemyManager";
import { IronSkeletonStateMachine } from "./IronSkeletonStateMachine";


const { ccclass, property } = _decorator;



@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  Attack() {
    //不具备攻击能力
    return
  }
  async init(params:IEntity){
    this.render()
    this.fsm=this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}
