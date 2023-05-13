// 玩家动画状态机
import { _decorator, AnimationClip, Component,Animation} from 'cc';
import { ENTITY_STATE_ENUM, EVENT_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../../../Enum';
import State from '../../../Base/State';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../../Base/StateMachine';
import IdleSubStateMachine from './StateMachine/IdleSubStateMachine';
import AttackSubStateMachine from './StateMachine/AttackSubStateMachine';
import DeathSubStateMachine from './StateMachine/DeathSubStateMachine';
import { EntityManager } from '../../../Base/EntityManager';
import { EventManager } from '../../../Runtime/EventManager';

const { ccclass, } = _decorator;



@ccclass('IronSkeletonStateMachine')
export class IronSkeletonStateMachine extends StateMachine {


  initAnimationEvents(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      const name=this.animationComponent.defaultClip.name
      // const type=this.currentState.path
      const whiteList=['attack']
      if(whiteList.some(v=>name.includes(v))){
        this.node.getComponent(EntityManager).state=ENTITY_STATE_ENUM.IDLE
        // this.setParams(PARAMS_NAME_ENUM.IDLE,true)
      }
      if(name.includes('death')){
        EventManager.Instance.emit(EVENT_ENUM.CHECKDOOR)
      }
    })
  }
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsTrigger())
  }
  initStateMachines(){
    this.stateMachines.set(ENTITY_STATE_ENUM.IDLE,new IdleSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK,new AttackSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.DEATH,new DeathSubStateMachine(this))
  }
  run(){
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.DEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
        }else {
          this.currentState = this.currentState
        }
        break
        case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
          if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
            this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
          }
          break
      default:
        this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
