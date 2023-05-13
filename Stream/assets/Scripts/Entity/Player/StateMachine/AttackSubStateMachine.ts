import { AnimationClip } from "cc"
import { DIRECTION_ENUM } from "../../../../Enum"
import DirectionSubStateMachine from "../../../Base/DirectionStateMachine"
import State, { ANIMATION_SPEED } from "../../../Base/State"


// const BASE_URL="texture/player/turnright/"
const BASE_URL = 'texture/player/attack'
export default class AttackSubStateMachine extends DirectionSubStateMachine{
  initStateMachines(): void {
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(this.fsm, `${BASE_URL}/top`,AnimationClip.WrapMode.Normal,[{
      frame:ANIMATION_SPEED*4,
      func:'onDeathShake',
      params:[0],
    }]))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(this.fsm, `${BASE_URL}/bottom`,AnimationClip.WrapMode.Normal,[{
      frame:ANIMATION_SPEED*4,
      func:'onDeathShake',
      params:[0],
    }]))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(this.fsm, `${BASE_URL}/left`,AnimationClip.WrapMode.Normal,[{
      frame:ANIMATION_SPEED*4,
      func:'onDeathShake',
      params:[0],
    }]))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(this.fsm, `${BASE_URL}/right`,AnimationClip.WrapMode.Normal,[{
      frame:ANIMATION_SPEED*4,
      func:'onDeathShake',
      params:[0],
    }]))
  }
}
