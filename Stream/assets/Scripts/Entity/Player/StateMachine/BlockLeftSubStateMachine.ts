import { DIRECTION_ENUM } from "../../../../Enum"
import DirectionSubStateMachine from "../../../Base/DirectionStateMachine"
import State from "../../../Base/State"

// const BASE_URL="texture/player/turnright/"
const BASE_URL = 'texture/player/blockleft'
export default class BlockLeftSubStateMachine extends DirectionSubStateMachine{
  initStateMachines(): void {
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(this.fsm, `${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(this.fsm, `${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(this.fsm, `${BASE_URL}/left`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(this.fsm, `${BASE_URL}/right`))
  }
}
