// 玩家动画状态机
import { _decorator, AnimationClip, Component,Animation} from 'cc';

import IdleSubStateMachine from './StateMachine/IdleSubStateMachine';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../../Enum';
import DeathSubStateMachine from './StateMachine/DeathSubStateMachine';
import { SmokeManager } from './SmokeManager';
// import { EntityManager } from '../../Base/EntityManager';


const { ccclass, } = _decorator;



@ccclass('SmokeStateMachine')
export class SmokeStateMachine extends StateMachine {


  initAnimationEvents(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      const name=this.animationComponent.defaultClip.name
      // const type=this.currentState.path
      const whiteList=["idle"]
      if(whiteList.some(v=>name.includes(v))){
        this.node.destroy()
        // this.node.getComponent(SmokeManager).state=ENTITY_STATE_ENUM.DEATH
      }
    })
  }
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
  }
  initStateMachines(){
    this.stateMachines.set(ENTITY_STATE_ENUM.IDLE,new IdleSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.DEATH,new DeathSubStateMachine(this))
  }
  run(){
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      default:
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
    }
  }
}
