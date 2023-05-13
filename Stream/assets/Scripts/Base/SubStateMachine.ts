import { _decorator, AnimationClip, Component,Animation} from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import State from '../Base/State';
import { StateMachine } from './StateMachine';

const { ccclass, } = _decorator;

type ParamsValueType=boolean|number
export interface IparamsValue{
  type:FSM_PARAMS_TYPE_ENUM,
  value:ParamsValueType
}

export const getInitParamsTrigger=()=>{
  return{
    type:FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value:false
  }
}
export const getInitParamsNumber=()=>{
  return{
    type:FSM_PARAMS_TYPE_ENUM.NUMBER,
    value:0
  }
}

// @ccclass('StateMachine')
export abstract class SubStateMachine {
  protected _currentState:State=null
  params:Map<string,IparamsValue>=new Map()
  stateMachines:Map<string,State>=new Map()
  animationComponent:Animation
  constructor(public fsm:StateMachine){
    this.init()
  }
  get currentState(){
    return this._currentState
  }
  set currentState(value:State){
    this._currentState=value
    this.currentState.run()
  }
  async init(){
    this.initStateMachines()
    // this.initAnimationEvents()

  }
  abstract run(): void
  // abstract initAnimationEvents():void
  abstract initStateMachines():void
}
