import { AnimationClip } from "cc";
import { DIRECTION_ENUM,} from "../../../../../Enum";
import DirectionSubStateMachine from "../../../../Base/DirectionStateMachine";
import State from "../../../../Base/State";

const BASE_URL="texture/ironskeleton/idle/"
export default class IdleSubStateMachine extends DirectionSubStateMachine{
  initStateMachines(): void {
    this.stateMachines.set(DIRECTION_ENUM.TOP,new State(this.fsm,BASE_URL+"top",AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT,new State(this.fsm,BASE_URL+"right",AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM,new State(this.fsm,BASE_URL+"bottom",AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.LEFT,new State(this.fsm,BASE_URL+"left",AnimationClip.WrapMode.Loop))
  }
}
