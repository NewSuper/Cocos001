// 玩家动画状态机
import { _decorator,Animation} from 'cc';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../../Enum';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import IdleSubStateMachine from './StateMachine/IdleSubStateMachine';
import TurnRightSubStateMachine from './StateMachine/TurnRightSubStateMachine';
import TurnLeftSubStateMachine from './StateMachine/TurnLeftSubStateMachine';
import BlockFrontSubStateMachine from './StateMachine/BlockFrontSubStateMachine';
import BlockBackSubStateMachine from './StateMachine/BlockBackSubStateMachine';
import BlockLeftSubStateMachine from './StateMachine/BlockLeftSubStateMachine';
import BlockRightSubStateMachine from './StateMachine/BlockRightSubStateMachine';
import BlockTurnLeftSubStateMachine from './StateMachine/BlockTurnLeftSubStateMachine';
import BlockTurnRightSubStateMachine from './StateMachine/BlockTurnRightSubStateMachine';
import DeathSubStateMachine from './StateMachine/DeathSubStateMachine';
import AirDeathSubStateMachine from './StateMachine/AirDeathSubStateMachine';
import AttackSubStateMachine from './StateMachine/AttackSubStateMachine';
import { EntityManager } from '../../Base/EntityManager';

const { ccclass, } = _decorator;



@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {


  initAnimationEvents(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      const name=this.animationComponent.defaultClip.name
      // const type=this.currentState.path
      const whiteList=['turn','block',"attack"]
      if(whiteList.some(v=>name.includes(v))){
        this.node.getComponent(EntityManager).state=ENTITY_STATE_ENUM.IDLE
      }
    })
  }
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKBACK,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.AIRDEATH,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsTrigger())
  }
  initStateMachines(){
    this.stateMachines.set(ENTITY_STATE_ENUM.IDLE,new IdleSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.TURNRIGHT,new TurnRightSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.TURNLEFT,new TurnLeftSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.BLOCKFRONT,new BlockFrontSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.BLOCKBACK,new BlockBackSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.BLOCKLEFT,new BlockLeftSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.BLOCKRIGHT,new BlockRightSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.BLOCKTURNLEFT,new BlockTurnLeftSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.BLOCKTURNRIGHT,new BlockTurnRightSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK,new AttackSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.AIRDEATH,new AirDeathSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.DEATH,new DeathSubStateMachine(this))
  }
  run(){
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.TURNRIGHT)
        }else if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.TURNLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.BLOCKFRONT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.BLOCKFRONT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.BLOCKLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.BLOCKRIGHT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.BLOCKTURNLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.BLOCKTURNRIGHT)
        }else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.DEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.AIRDEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
        }else {
          this.currentState = this.currentState
        }
        break
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
        if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.DEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.AIRDEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
        }
        break
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
        if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.DEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.AIRDEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
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
