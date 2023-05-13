import { AnimationClip } from "cc"
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM,} from "../../../../Enum"
import State from "../../../Base/State"

import DirectionSubStateMachine from "../../../Base/DirectionStateMachine"
import { SubStateMachine } from "../../../Base/SubStateMachine"



const BASE_URL="texture/door/idle/"
export default class IdleSubStateMachine extends SubStateMachine{
  run(): void {
    const value=this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
    this.currentState=this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }

  initStateMachines(): void {
    this.stateMachines.set(DIRECTION_ENUM.LEFT,new State(this.fsm,BASE_URL+"left"))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT,new State(this.fsm,BASE_URL+"left"))
    this.stateMachines.set(DIRECTION_ENUM.TOP,new State(this.fsm,BASE_URL+"top"))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM,new State(this.fsm,BASE_URL+"top"))
  }
}
