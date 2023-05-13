// 玩家动画状态机
import { _decorator, AnimationClip, Component,Animation} from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import State from '../Base/State';
import { SubStateMachine } from './SubStateMachine';

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

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  protected _currentState:State|SubStateMachine=null
  params:Map<string,IparamsValue>=new Map()
  stateMachines:Map<string,State|SubStateMachine>=new Map()
  animationComponent:Animation
  waitinglist:Array< Promise<AnimationClip>>=[]
  setParams(paramName:string,value:ParamsValueType){
    if(this.params.has(paramName)){
      this.params.get(paramName).value=value
      this.run()
      this.resetTrigger()
    }
  }
  getParams(paramName:string):ParamsValueType {
    if(this.params.has(paramName)){
      return this.params.get(paramName).value
    }
  }
  // getNumberParams(paramName:string):number{
  //   if(this.params.has(paramName)){
  //     return this.params.get(paramName).value as number
  //   }
  // }
  // getTriggerParams(paramName:string):boolean{
  //   if(this.params.has(paramName)){
  //     return this.params.get(paramName).value as boolean
  //   }
  // }
  get currentState(){
    return this._currentState
  }
  set currentState(value:State|SubStateMachine){
    this._currentState=value
    this.currentState.run()
  }
  async init(){
    this.animationComponent=this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvents()
    await Promise.all(this.waitinglist)
  }

  resetTrigger():void{
  for(const[_,value] of this.params){
    if(value.type===FSM_PARAMS_TYPE_ENUM.TRIGGER){
      if(value.value){
        value.value=false
      }
    }
  }
  }
  abstract run(): void
  abstract initAnimationEvents():void
  abstract initParams():void
  abstract initStateMachines():void
}
