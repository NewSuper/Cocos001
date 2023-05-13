import { _decorator, Component,  Sprite,  UITransform ,Animation, } from 'cc';
import { TILE_HIGHT, TILE_WIDTH } from '../Tile/TileManager';
import {  DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM,  PARAMS_NAME_ENUM } from '../../Enum';

import { StateMachine } from './StateMachine';
import { IEntity } from '../../Level';
import { DataManager } from '../Runtime/DataManager';

const { ccclass, } = _decorator;



@ccclass('EntityManager')
export class EntityManager extends Component {
  x:number=0
  y:number=0
  animationComponent:Animation
  type:ENTITY_TYPE_ENUM
  fsm:StateMachine
  id:number

  private _direction:DIRECTION_ENUM
  private _state:ENTITY_STATE_ENUM
  set direction(value:DIRECTION_ENUM){
    this._direction=value
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION,DIRECTION_ORDER_ENUM[value])
  }
  get direction():DIRECTION_ENUM{
    return this._direction
  }
  set state(newstate:ENTITY_STATE_ENUM){
    this._state=newstate
    this.fsm.setParams(newstate,true)
  }
  get state():ENTITY_STATE_ENUM{
    return this._state
  }
  init(params:IEntity){
    this.x=params.x
    this.y=params.y
    this.direction=params.direction
    this.state=params.state
    this.type=params.type
    this.id=DataManager.Instance.CreatID()
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
