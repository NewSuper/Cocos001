// 玩家动画状态机
import { _decorator, AnimationClip, Component,Animation} from 'cc';

import IdleSubStateMachine from './StateMachine/IdleSubStateMachine';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../../Enum';
import DeathSubStateMachine from './StateMachine/DeathSubStateMachine';
import AttackSubStateMachine from './StateMachine/AttackSubStateMachine';
// import { EntityManager } from '../../Base/EntityManager';


const { ccclass, } = _decorator;



@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {


  initAnimationEvents(){

  }
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsTrigger())

  }
  initStateMachines(){
    this.stateMachines.set(ENTITY_STATE_ENUM.IDLE,new IdleSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.DEATH,new DeathSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK,new AttackSubStateMachine(this))
  }
  //不具备参数不会执行
  run(){
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
        }
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
        if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.DEATH)
        }
      default:
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
        }
        break
    }
  }
}
