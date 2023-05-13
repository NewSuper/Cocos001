import { DIRECTION_ENUM,} from "../../../../Enum";
import SpikeSubStateMachine from "../../../Base/SpikeSubStateMachine";
import State from "../../../Base/State";

// const BASE_URL="texture/player/turnright/"
const BASE_URL = 'texture/spikes/spikesone'
export default class SpikeOneSubStateMachine extends SpikeSubStateMachine{
  initStateMachines(): void {
    this.stateMachines.set('0', new State(this.fsm, `${BASE_URL}/zero`))
    this.stateMachines.set('1', new State(this.fsm, `${BASE_URL}/one`))
    this.stateMachines.set('2', new State(this.fsm, `${BASE_URL}/two`))
  }
}
