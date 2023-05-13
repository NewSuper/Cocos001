import { _decorator, Component, Layers, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { TILE_TYPE_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

export const TILE_WIDTH=55
export const TILE_HIGHT=55

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM
  moveable: boolean
  turnable: boolean
  x:number
  y:number
    init(type:TILE_TYPE_ENUM,spriteFrame:SpriteFrame,x:number,y:number){
      this.type = type
      this.x=x
      this.y=y
    if (
      // this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      // this.type === TILE_TYPE_ENUM.WALL_ROW ||
      // this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
      // this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      // this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM ||
      // this.type === TILE_TYPE_ENUM.WALL_COLUMN
      this.type.includes("WALL")
    ) {
      this.moveable = false
      this.turnable = false
    } else if (
      // this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
      // this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
      // this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
      this.type.includes("CLIFF")
    ) {
      this.moveable = false
      this.turnable = true
    } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
      this.moveable = true
      this.turnable = true
    }


      const sprite= this.node.addComponent(Sprite)
      sprite.spriteFrame=spriteFrame

      const transform= this.getComponent(UITransform)
      transform.setContentSize(TILE_WIDTH,TILE_HIGHT)

      this.node.setPosition(x*TILE_WIDTH,-y*TILE_HIGHT)
    }
  }
