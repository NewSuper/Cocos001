import {
    _decorator, Sprite, UITransform,
} from 'cc';

import {
    CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM,
    EVENT_ENUM
} from '../../../Enum';
import { EntityManager } from '../../Base/EntityManager';
import { DataManager } from '../../Runtime/DataManager';
import { EventManager } from '../../Runtime/EventManager';
import { TILE_HIGHT, TILE_WIDTH, TileManager } from '../../Tile/TileManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { IEntity } from '../../../Level';

const { ccclass } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  targetX:number=-1
  targetY:number=-1
  isMoving:boolean=false
  canAttack:boolean=false
  private readonly speed=0.1
    async init(params:IEntity){
      this.render()
      this.fsm=this.addComponent(PlayerStateMachine)
      await this.fsm.init()
      super.init(params)
      this.targetX=params.x
      this.targetY=params.y
      EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.inputHandle,this)
      EventManager.Instance.on(EVENT_ENUM.PLAYER_DEATH,this.onDeath,this)
      EventManager.Instance.on(EVENT_ENUM.PLAYER_AIRDEATH,this.onAirDeath,this)
      this.isMoving=true
      this.canAttack=false
    }

    protected onDestroy(): void {
      EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL,this.inputHandle)
      EventManager.Instance.off(EVENT_ENUM.PLAYER_DEATH,this.onDeath)
      EventManager.Instance.off(EVENT_ENUM.PLAYER_AIRDEATH,this.onAirDeath)
    }
    protected update(dt: number): void {
        this.updatePos()
        // 左下为零
        this.node.setPosition((this.x-1.5)*TILE_WIDTH,(1.5-this.y)*TILE_HIGHT)
    }
    onDeath(){
      this.state=ENTITY_STATE_ENUM.DEATH
      this.onDeathShake()
    }
    onAirDeath(){
        this.state=ENTITY_STATE_ENUM.AIRDEATH
        this.onDeathShake()
    }
    onDeathShake(){
      EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE,DIRECTION_ENUM.BOTTOM)
    }

    onAttackShake(){
      EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE,this.direction)
    }
    render(){
      const sprite= this.addComponent(Sprite)
      sprite.sizeMode=Sprite.SizeMode.CUSTOM

      const transform=this.getComponent(UITransform)
      transform.setContentSize(TILE_WIDTH*4,TILE_HIGHT*4)
    }
    updatePos(): void{
      if(!this.isMoving){
        return
      }
      if(this.x===this.targetX&&this.y===this.targetY){
        //移动结束
        this.isMoving=false
        this.moveEndBefore()
        this.moveEndAfter()
      }
      if(this.targetX<this.x){
        this.x-=this.speed
      }else if(this.targetX>this.x){
        this.x+=this.speed
      }
      if(this.targetY<this.y){
        this.y-=this.speed
      }else if(this.targetY>this.y){
        this.y+=this.speed
      }
      if(Math.abs(this.targetX-this.x)<0.01){
        this.x=this.targetX
      }
      if(Math.abs(this.targetY-this.y)<0.01){
        this.y=this.targetY
      }
    }
    onAttack(){
        if(this.canAttack){
          this.canAttack=false
        }else{
          return
        }
        //方向和攻击方向一致

        for (const enemy of DataManager.Instance.enemies) {
          const {x,y}=enemy
          //敌人的位置正好在枪尖的位置
          const [weaponX,weaponY]= calculateWeaponPostion([this.x,this.y],this.direction)
          if(enemy.state===ENTITY_STATE_ENUM.DEATH){
            continue
          }
          if(x===weaponX&&y===weaponY){
            this.state=ENTITY_STATE_ENUM.ATTACK
            EventManager.Instance.emit(EVENT_ENUM.ENEMY_DEATH,enemy.id)
          }
        }
    }
    openDoor(){
      if(DataManager.Instance.door&&this.x===DataManager.Instance.door.x&&this.y===DataManager.Instance.door.y
        &&DataManager.Instance.door.state===ENTITY_STATE_ENUM.DEATH){
        EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
      }
    }
    inputHandle(inputDirection:CONTROLLER_ENUM){
      if(this.state===ENTITY_STATE_ENUM.DEATH||this.state===ENTITY_STATE_ENUM.AIRDEATH){
        console.log("玩家已死亡，无法操作")
        return
      }
      if(this.isMoving){
        return
      }

      if (this.canMove(inputDirection))
      {
        EventManager.Instance.emit(EVENT_ENUM.RECORD)
        this.moveBefore(inputDirection)
        this.move(inputDirection)

      }else{
        let direction:DIRECTION_ENUM=DIRECTION_ENUM.BOTTOM
        switch(inputDirection){
          case(CONTROLLER_ENUM.TURNRIGHT):
          case(CONTROLLER_ENUM.TURNLEFT):
            direction=calculateNextDirction(this.direction,inputDirection)
            break
          default:
            direction=DIRECTION_ENUM[inputDirection]
        }
        // const direction:DIRECTION_ENUM=calculateNextDirction(this.direction,inputDirection)
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE,direction)
      }
    }
    moveBefore(inputDirection:CONTROLLER_ENUM){
      EventManager.Instance.emit(EVENT_ENUM.GEN_SMOKE,
        {x:this.x,y:this.y,direction:this.direction,state:ENTITY_STATE_ENUM.IDLE,type:ENTITY_TYPE_ENUM.SMOKE})
    }
    moveEndBefore(){
      //判断是否到了攻击范围
      // this.onAttack()
      this.openDoor()
    }

    moveEndAfter(){
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }


    canMove(inputDirection: CONTROLLER_ENUM):boolean {
      // console.log(DataManager.Instance.tileInfo)
          //获得下一个将要移动的tile。判断是否是可以移动的
    const {targetX:x,targetY:y,direction}=this
    const {tileInfo}=DataManager.Instance

    let [playerTile,weaponTile]=
    // calculateRotationBlock(inputDirection,direction,{x,y},tileInfo)
    calculateTouchTile([x,y],inputDirection,direction,tileInfo)
    const door=DataManager.Instance.door
    const player=DataManager.Instance.player
    const bursts=DataManager.Instance.bursts
    //检查人
    //检查武器
    //检查是否会与门碰撞
    if(door&&door.state===ENTITY_STATE_ENUM.IDLE){
      if(playerTile&& playerTile.x===door.x&&playerTile.y===door.y){
        return false
      }
      //存在空格子的情况。空格子是可以移动的，但是移动就会死。武器可以在空格子上
      if(weaponTile &&weaponTile.length>0){
        for (const iterator of weaponTile) {
          if(iterator&& iterator.x===door.x&&iterator.y===door.y){
            return false
          }
      }
    }
    }
    //确认玩家的下一个格子是否是可以移动的。
    if(weaponTile.length>0){
      for (const iterator of weaponTile) {
        //空方格，武器是可以移动的
        //如果不为空，且不能转向，则发生碰撞
        if(iterator&&!iterator.turnable){
          if(inputDirection===CONTROLLER_ENUM.TOP){
            this.state=ENTITY_STATE_ENUM.BLOCKFRONT
          }else if(inputDirection===CONTROLLER_ENUM.BOTTOM){
            this.state=ENTITY_STATE_ENUM.BLOCKBACK
          }else if(inputDirection===CONTROLLER_ENUM.LEFT){
            this.state=ENTITY_STATE_ENUM.BLOCKLEFT
          }else if(inputDirection===CONTROLLER_ENUM.RIGHT){
            this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
          }else if(inputDirection===CONTROLLER_ENUM.TURNLEFT){
            this.state=ENTITY_STATE_ENUM.BLOCKTURNLEFT
          }else if(inputDirection===CONTROLLER_ENUM.TURNRIGHT){
            this.state=ENTITY_STATE_ENUM.BLOCKTURNRIGHT
          }
          return false
        }
      }
    }
    if(playerTile&&playerTile.moveable){
      //如果存在，直接返回是否是可以移动的
      return true
    }else{
      //否者检查是不是可以移动的陷阱
      const [nextX,nextY]=calculateNextPostion([this.x,this.y],inputDirection)
      for(const burst of bursts){
        //如果表示可以移动
        if(burst.x===nextX&&burst.y===nextY){
          // if(burst.state!==ENTITY_STATE_ENUM.DEATH){
          //   return true
          // }
          return true
        }
      }
      //空的，且不是陷阱
      return false
    }
    }

    willblock(inputDirection: CONTROLLER_ENUM):boolean {
    //获得下一个将要移动的tile。判断是否是可以移动的
    return false
    }
    move(inputDirection:CONTROLLER_ENUM){

      if(this.direction.toString()==inputDirection.toString()){
        // const [weaponX,weaponY]=calculateWeaponPostion([this.x,this.y],this.direction)
        const [NextweaponX,NextweaponY]=calculateWeaponPostion(calculateWeaponPostion([this.x,this.y],this.direction),calculateNextDirction(this.direction,inputDirection))
        for (const enemy of DataManager.Instance.enemies) {
          const {x,y}=enemy
          //敌人的位置正好在枪尖的位置
          if(enemy.state===ENTITY_STATE_ENUM.DEATH){
            continue
          }
          if(x===NextweaponX&&y===NextweaponY){
            this.state=ENTITY_STATE_ENUM.ATTACK
            EventManager.Instance.emit(EVENT_ENUM.ENEMY_DEATH,enemy.id)
            EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE,this.direction)
            return
          }
        }
      }
    switch (inputDirection) {
      case CONTROLLER_ENUM.TOP:
        this.targetY-=1
      break
      case CONTROLLER_ENUM.BOTTOM:
        this.targetY+=1
        break
      case CONTROLLER_ENUM.RIGHT:
        this.targetX+=1
        break
      case CONTROLLER_ENUM.LEFT:
        this.targetX-=1
        break
      case CONTROLLER_ENUM.TURNLEFT:
        this.direction=calculateNextDirction(this.direction,inputDirection)
        this.state=ENTITY_STATE_ENUM.TURNLEFT
        break
      case CONTROLLER_ENUM.TURNRIGHT:
        this.direction=calculateNextDirction(this.direction,inputDirection)
      default:
        break;
      }
      this.isMoving=true
      // 移动方向和方向一致才能攻击


    }
}
function calculateNextDirction(direction:DIRECTION_ENUM,control:CONTROLLER_ENUM):DIRECTION_ENUM{
  let index:number
  if (control===CONTROLLER_ENUM.TURNLEFT){
    index=DIRECTION_ORDER_ENUM[direction]-1
    if(index<1){
      index=4
    }
  }else if(control===CONTROLLER_ENUM.TURNRIGHT){
    index=DIRECTION_ORDER_ENUM[direction]+1
    if(index>4){
      index=1
    }
  }else{
    index= DIRECTION_ORDER_ENUM[direction]
  }
  return DIRECTION_ENUM[DIRECTION_ORDER_ENUM[index]]
}
function calculateWeaponPostion(pos:[number,number],direction:DIRECTION_ENUM):[number,number]{

  const [x,y]=pos
  let weaponX:number
  let weaponY:number
  if(direction===DIRECTION_ENUM.TOP){
    weaponX=x
    weaponY=y-1
  } else if(direction===DIRECTION_ENUM.BOTTOM){
    weaponX=x
    weaponY=y+1
  }
  else if(direction===DIRECTION_ENUM.LEFT){
    weaponX=x-1
    weaponY=y
  }
  else if(direction===DIRECTION_ENUM.RIGHT){
    weaponX=x+1
    weaponY=y
  }
  return [weaponX,weaponY]
}
function calculateNextPostion(pos:[number,number],inputDirection:CONTROLLER_ENUM):[number,number]{
  const [x,y]=pos
  if(inputDirection===CONTROLLER_ENUM.TOP){
    return[x,y-1]
  }else if(inputDirection===CONTROLLER_ENUM.BOTTOM){
    return[x,y+1]
  }else if(inputDirection===CONTROLLER_ENUM.LEFT){
    return[x-1,y]
  }else if(inputDirection===CONTROLLER_ENUM.RIGHT){
    return[x+1,y]
  }else{
    return[x,y]
  }
}
function calculateTouchTile(pos:[number,number],inputDirection:CONTROLLER_ENUM,direction: DIRECTION_ENUM,tileInfo:Array<Array<TileManager>>):[TileManager,TileManager[]]{
  const [x,y]=pos
  const [weaponX,weaponY]=calculateWeaponPostion(pos,direction)
  let playerTile:TileManager
  let weaponTile :Array<TileManager>=[]
  try {
    if(inputDirection===CONTROLLER_ENUM.TOP){
      playerTile=tileInfo[x][y-1]
      weaponTile[0]=tileInfo[weaponX][weaponY-1]
    }else if(inputDirection===CONTROLLER_ENUM.BOTTOM){
      playerTile=tileInfo[x][y+1]
      weaponTile[0]=tileInfo[weaponX][weaponY+1]
    }else if(inputDirection===CONTROLLER_ENUM.LEFT){
      playerTile=tileInfo[x-1][y]
      weaponTile[0]=tileInfo[weaponX-1][weaponY]
    }else if(inputDirection===CONTROLLER_ENUM.RIGHT){
      playerTile=tileInfo[x+1][y]
      weaponTile[0]=tileInfo[weaponX+1][weaponY]
    }else{
      const [NextweaponX,NextweaponY]=calculateWeaponPostion(pos,calculateNextDirction(direction,inputDirection))
      playerTile=tileInfo[x][y]
      weaponTile[0]=tileInfo[NextweaponX][NextweaponY]
      //获得过渡方格。过渡方格的xy和玩家的xy完全不同
      let excessX:number
      let excessY:number
      excessX=NextweaponX===x?weaponX:NextweaponX
      excessY=NextweaponY===y?weaponY:NextweaponY
      weaponTile[1]=tileInfo[excessX][excessY]
    }

  } catch (error) {

  }
  return [playerTile,weaponTile]
}
