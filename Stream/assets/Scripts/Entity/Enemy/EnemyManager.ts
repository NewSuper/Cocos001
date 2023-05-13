import { Sprite, UITransform, _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../../Enum";
import { SubStateMachine } from "../../Base/SubStateMachine";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { EventManager } from "../../Runtime/EventManager";
import { DataManager } from "../../Runtime/DataManager";
import { TILE_HIGHT, TILE_WIDTH } from "../../Tile/TileManager";
import { IEntity } from "../../../Level";
import { WoodenSkeletonStateMachine } from "./WoodenSkeleton/WoodenSkeletonStateMachine";



const { ccclass, property } = _decorator;



@ccclass('EnemyManager')
export abstract class EnemyManager extends EntityManager {
  init(params:IEntity ):void{
    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.lookAt,this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack,this)
    EventManager.Instance.on(EVENT_ENUM.ENEMY_DEATH,this.onDeath,this)
  }
  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.lookAt)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack)
    EventManager.Instance.off(EVENT_ENUM.ENEMY_DEATH,this.onDeath)
  }
  onDeath(id:number){
    if(id===this.id){
      this.state=ENTITY_STATE_ENUM.DEATH
      // EventManager.Instance.emit(EVENT_ENUM.CHECKDOOR)
    }
  }
  lookAt(){
    if(this.state===ENTITY_STATE_ENUM.DEATH){
      // console.log('${this.id}已经死亡，无法进行攻击')
      return
    }
    const {targetX:x,targetY:y}=DataManager.Instance.player
    if(Math.abs(x-this.x)>Math.abs(y-this.y)){
//以x轴为准
      if(x<this.x){
        this.direction=DIRECTION_ENUM.LEFT
      }else{
        this.direction=DIRECTION_ENUM.RIGHT
      }
    }
    else if(Math.abs(x-this.x)<Math.abs(y-this.y)){
//以y轴为准
      if(y<this.y){
        this.direction=DIRECTION_ENUM.TOP
      }else{
        this.direction=DIRECTION_ENUM.BOTTOM
      }
    }
  }
  onAttack(){
    if(this.state===ENTITY_STATE_ENUM.DEATH){
      console.log('${this.id}已经死亡，无法进行攻击')
      return
    }
    this.Attack()
  }
  abstract Attack()

  render(){
    const sprite= this.addComponent(Sprite)
    sprite.sizeMode=Sprite.SizeMode.CUSTOM
    const transform=this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH*4,TILE_HIGHT*4)
  }
}
