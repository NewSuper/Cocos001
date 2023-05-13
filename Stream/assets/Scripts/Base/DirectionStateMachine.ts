import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../../Enum";
import { SubStateMachine } from "../Base/SubStateMachine";

// const BASE_URL="texture/player/turnright/"
export default abstract class DirectionSubStateMachine extends SubStateMachine{
  run(): void {
    const value=this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
    this.currentState=this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
    // /
  }
}
