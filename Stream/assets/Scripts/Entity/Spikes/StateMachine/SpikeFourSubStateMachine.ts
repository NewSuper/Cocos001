import { DIRECTION_ENUM,} from "../../../../Enum";
import SpikeSubStateMachine from "../../../Base/SpikeSubStateMachine";
import State from "../../../Base/State";

// const BASE_URL="texture/player/turnright/"
const BASE_URL = 'texture/spikes/spikesfour'
export default class SpikeFourSubStateMachine extends SpikeSubStateMachine{
  initStateMachines(): void {
    this.stateMachines.set('0', new State(this.fsm, `${BASE_URL}/zero`))
    this.stateMachines.set('1', new State(this.fsm, `${BASE_URL}/one`))
    this.stateMachines.set('2', new State(this.fsm, `${BASE_URL}/two`))
    this.stateMachines.set('3', new State(this.fsm, `${BASE_URL}/three`))
    this.stateMachines.set('4', new State(this.fsm, `${BASE_URL}/four`))
    this.stateMachines.set('5', new State(this.fsm, `${BASE_URL}/five`))
  }
}
