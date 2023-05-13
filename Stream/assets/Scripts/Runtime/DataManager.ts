import { ILevel, ITile } from "../../Level"
import { EntityManager } from "../Base/EntityManager"
import Singleton from "../Base/Singleton"
import { BurstManager } from "../Entity/Burst/BurstManager"
import { DoorManager } from "../Entity/Door/DoorManager"
import { PlayerManager } from "../Entity/Player/PlayerManager"
import { SpikeManager } from "../Entity/Spikes/SpikeManager"
import { TileManager } from "../Tile/TileManager"

export type IRecord=Omit<ILevel,'mapInfo'>

export class DataManager extends Singleton {
  static get Instance() {
      return super.GetInstance<DataManager>()
  }
  reset(){
    this.mapInfo=[]
    this.mapRowCount = 0
    this.mapColumCount = 0
    this.records=[]
    this.player=null
    this.door=null
    this.enemies=[]
    this.bursts=[]
    this.spikes=[]

  }
  player:PlayerManager
  enemies:Array<EntityManager>=[]
  bursts:Array<BurstManager>=[]
  spikes:Array<SpikeManager>=[]
  door:DoorManager
  mapInfo:Array<Array<ITile>>
  tileInfo:Array<Array<TileManager>>
  mapRowCount:number
  mapColumCount:number
  levelIndex:number=1
  records:IRecord[]=[]

  private static id:number=0
  CreatID():number{
    return DataManager.id++
  }
}

// const hh=DataManager.Instance
// export const DataManagerInstance=new DataManager()
