import { PARAMS_NAME_ENUM } from "../../Enum"
import { SubStateMachine } from "./SubStateMachine"


// const BASE_URL="texture/player/turnright/"
export default abstract class SpikeSubStateMachine extends SubStateMachine{
  run(): void {
    const value=this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState=this.stateMachines.get(value.toString())
  }
}
