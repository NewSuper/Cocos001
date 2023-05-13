// 玩家动画状态机
import { _decorator, AnimationClip, Component,Animation} from 'cc';

import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM, SPIKE_STATE_ENUM } from '../../../Enum';
import SpikeOneSubStateMachine from './StateMachine/SpikeOneSubStateMachine';
import SpikeTwoSubStateMachine from './StateMachine/SpikeTwoSubStateMachine';
import SpikeThreeSubStateMachine from './StateMachine/SpikeThreeSubStateMachine';
import SpikeFourSubStateMachine from './StateMachine/SpikeFourSubStateMachine';

// import { EntityManager } from '../../Base/EntityManager';


const { ccclass, } = _decorator;



@ccclass('SpikeStateMachine')
export class SpikeStateMachine extends StateMachine {


  initAnimationEvents(){

  }
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,getInitParamsNumber())
  }
  initStateMachines(){
    this.stateMachines.set(ENTITY_STATE_ENUM.SPIKES_ONE,new SpikeOneSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.SPIKES_TWO,new SpikeTwoSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.SPIKES_THREE,new SpikeThreeSubStateMachine(this))
    this.stateMachines.set(ENTITY_STATE_ENUM.SPIKES_FOUR,new SpikeFourSubStateMachine(this))

  }
  //不具备参数不会执行
  run(){
    // if(this.currentState===this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)){
    //   return
    // }
    this.currentState=

    this.stateMachines.get(ENTITY_STATE_ENUM[SPIKE_STATE_ENUM[this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)as number]])
    console.log(this.stateMachines.get(ENTITY_STATE_ENUM[SPIKE_STATE_ENUM[this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)as number]]))
  }
}
