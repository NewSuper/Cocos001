import { ENTITY_STATE_ENUM } from "../../../../Enum"
import State from "../../../Base/State"
import { SubStateMachine } from "../../../Base/SubStateMachine"


const BASE_URL = 'texture/burst/attack'
export default class AttackSubStateMachine extends SubStateMachine{
  initStateMachines(): void {
    this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK,new State(this.fsm,BASE_URL))
  }
  run(): void {
    this.currentState=this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
  }

}
