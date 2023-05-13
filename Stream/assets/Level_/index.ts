import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from "../Enum";
import Level1 from "./Level1";
import Level2 from "./Level2";
// import * as ss from "./Level1"
const levels:Record<string,ILevel>={
  Level1,
  Level2
}

export interface IEntity{
  x:number;
  y:number;
  type:ENTITY_TYPE_ENUM
  direction:DIRECTION_ENUM;
  state:ENTITY_STATE_ENUM;
}
export interface ITile{
  src:number|null,
  type:TILE_TYPE_ENUM|null,
}
export interface ISpikes {
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  count: number
}

export interface ILevel{
  mapInfo:Array<Array<ITile>>
  player:IEntity
  enemies:Array<IEntity>
  spikes:Array<ISpikes>
  bursts:Array<IEntity>
  door:IEntity
}
// 暴露出去
export default levels
