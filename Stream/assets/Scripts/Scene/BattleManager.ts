import { _decorator, Component, director, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { creatUINode } from '../Utils';
import levels, { IEntity, ILevel, ISpikes } from '../../Level';
import { DataManager, IRecord } from '../Runtime/DataManager';
import { TILE_WIDTH } from '../Tile/TileManager';
import { EventManager } from '../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, MENU_ENUM, SCEEN_ENUM } from '../../Enum';
import { PlayerManager } from '../Entity/Player/PlayerManager';
import { WoodenSkeletonManager } from '../Entity/Enemy/WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Entity/Door/DoorManager';
import { IronSkeletonManager } from '../Entity/Enemy/Ironskeleton/IronSkeletonManager';
import { BurstManager } from '../Entity/Burst/BurstManager';
import { SpikeManager } from '../Entity/Spikes/SpikeManager';
import { SmokeManager } from '../Entity/Smoke/SmokeManager';
import { FaderManager } from '../Runtime/FaderManager';
import { ShakeManager } from '../UI/ShakeManager';


const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level:ILevel
    stage:Node
    smokeNode:Node
    private _inited:boolean
    onLoad(): void {
        this._inited=false
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this)
        EventManager.Instance.on(MENU_ENUM.RESTART,this.reStart,this)
        EventManager.Instance.on(MENU_ENUM.LAST_LEVEL,this.lastLevel,this)
        EventManager.Instance.on(EVENT_ENUM.GEN_SMOKE,this.generateSmoke,this)
        EventManager.Instance.on(EVENT_ENUM.UNDO,this.revoke,this)
        EventManager.Instance.on(EVENT_ENUM.RECORD,this.record,this)
        EventManager.Instance.on(MENU_ENUM.OUT,this.outGame,this)
    }
    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel)
        EventManager.Instance.off(MENU_ENUM.LAST_LEVEL,this.lastLevel)
        EventManager.Instance.off(MENU_ENUM.RESTART,this.reStart)
        EventManager.Instance.off(EVENT_ENUM.GEN_SMOKE,this.generateSmoke)
        EventManager.Instance.off(EVENT_ENUM.UNDO,this.revoke)
        EventManager.Instance.off(EVENT_ENUM.RECORD,this.record)
        EventManager.Instance.off(MENU_ENUM.OUT,this.outGame)
    }

    start() {
        this.generateStage()
        this.initLevel()
    }
    reStart(){
        this.initLevel()
    }
    async outGame(){
        await FaderManager.Instance.fadeIn(1000)
        director.loadScene(SCEEN_ENUM.start)
    }
    async initLevel(){
        if(this._inited){
            await FaderManager.Instance.fadeIn()
        }{
            this._inited=true
            await FaderManager.Instance.mask()

        }

        // console.log(levels)
        // DataManager.Instance.levelIndex=8
        const level=levels[`level${DataManager.Instance.levelIndex}`]
        // const level=levels[`level${7}`]
        // const level=Levels[`Level${1}`]
        if (level) {
            this.clearLevel()
            this.level=level

            DataManager.Instance.mapInfo=this.level.mapInfo
            DataManager.Instance.mapRowCount=this.level.mapInfo.length||0
            DataManager.Instance.mapColumCount=this.level.mapInfo[0].length||0


            await Promise.all([
                this.generateTileMap(),
                this.generateBurst(level.bursts),
                this.generateSpikes(level.spikes),
                this.generateEnemy(level.enemies),
                this.pregenerateSmoke(),

                this.generateDoor(level.door)
            ])

            await this.generatePlayer(level.player),
            await FaderManager.Instance.fadeOut()
        }
    }
    clearLevel(){
        this.stage.destroyAllChildren()
        DataManager.Instance.reset()
    }
    nextLevel(){
        DataManager.Instance.levelIndex++
        this.initLevel()
    }
    lastLevel(){
        DataManager.Instance.levelIndex--
        this.initLevel()
    }
    async generateStage(){
        this.stage=creatUINode("stage")
        this.stage.setParent(this.node)
        this.stage.addComponent(ShakeManager).init()

    }
    async generateDoor(params:IEntity){
        const door=creatUINode("door")
        door.setParent(this.stage)
        const doorManager=door.addComponent(DoorManager)
        await doorManager.init(params)
        DataManager.Instance.door=doorManager
    }
    async generatePlayer(params:IEntity) {
        const player=creatUINode("player")
        player.setParent(this.stage)
        const playerManager=player.addComponent(PlayerManager)
        await playerManager.init(params)
        DataManager.Instance.player=playerManager
    }
    async generateEnemy(params:Array<IEntity>) {
        DataManager.Instance.enemies=[]
        const promises=[]
        for (const enemy of params) {
        const enemyNode=creatUINode()
        enemyNode.setParent(this.stage)
        let enemyManager
        switch (enemy.type) {
            case ENTITY_TYPE_ENUM.SKELETON_WOODEN:
                enemyManager=enemyNode.addComponent(WoodenSkeletonManager)
                break;
            case ENTITY_TYPE_ENUM.SKELETON_IRON:
                enemyManager=enemyNode.addComponent(IronSkeletonManager)
                break;
            default:
                break;
        }
        promises.push(enemyManager.init(enemy))
        DataManager.Instance.enemies.push(enemyManager)
        }
        await Promise.all(promises)
    }
    async generateBurst(params:Array<IEntity>){
        DataManager.Instance.bursts=[]
        const promises=[]
        for (const burst of params) {
        const burstNode=creatUINode()
        burstNode.setParent(this.stage)
        const burstManager=burstNode.addComponent(BurstManager)
        promises.push(burstManager.init(burst))
        DataManager.Instance.bursts.push(burstManager)
        }
        await Promise.all(promises)
    }
    async generateSpikes(params:Array<ISpikes>){
        const promises=[]
        DataManager.Instance.enemies=[]
        for (const spike of params) {
        const spikeNode=creatUINode()
        spikeNode.setParent(this.stage)
        const spikeManager=spikeNode.addComponent(SpikeManager)
        promises.push(spikeManager.init(spike))
        DataManager.Instance.spikes.push(spikeManager)
        }
        await Promise.all(promises)
    }
    async generateTileMap() {

        const tileMap=creatUINode("tilemap")
        tileMap.setParent(this.stage)
        const tileMapManager =tileMap.addComponent(TileMapManager)
        tileMapManager.init()
        this.adapt()
    }
    async pregenerateSmoke(){
        const smoke=creatUINode("smokeRoot")
        smoke.setParent(this.stage)
        this.smokeNode=smoke
        await this.generateSmoke(
            {x:-10,y:-10,direction:DIRECTION_ENUM.BOTTOM,state:ENTITY_STATE_ENUM.IDLE,type:ENTITY_TYPE_ENUM.SMOKE})

    }
    async generateSmoke(params:IEntity){
        const smoke=creatUINode("smoke")
        smoke.setParent(this.smokeNode)
        const smokeManager=smoke.addComponent(SmokeManager)
        await smokeManager.init(params)
        //可以使用对象池
        // DataManager.Instance.player=playerManager
    }
    adapt(){
        const {mapRowCount,mapColumCount}=DataManager.Instance
        const disX=TILE_WIDTH*mapRowCount/2;
        const disY=TILE_WIDTH*mapColumCount/2+80;
        this.stage.setPosition(-disX,disY)
    }

    record(){
        const item:IRecord=
        {
            // player:DataManager.Instance.player,
            player: {
                x: DataManager.Instance.player.x,
                y: DataManager.Instance.player.y,
                direction: DataManager.Instance.player.direction,
                state: DataManager.Instance.player.state,
                type: DataManager.Instance.player.type,
            },
            enemies: DataManager.Instance.enemies.map(({x,y,direction,state,type})=>({x,y,direction,state,type})),
            spikes: DataManager.Instance.spikes.map(({x,y,count,type})=>({x,y,count,type})),
            bursts: DataManager.Instance.bursts.map(({x,y,direction,state,type})=>({x,y,direction,state,type})),
            door:  {
                x: DataManager.Instance.door.x,
                y: DataManager.Instance.door.y,
                direction: DataManager.Instance.door.direction,
                state: DataManager.Instance.door.state,
                type: DataManager.Instance.door.type,
            },
        }
        DataManager.Instance.records.push(item)
        console.log(item)
    }
    revoke(){
        const item=DataManager.Instance.records.pop()
        if(!item){
            return
        }
        //设置玩家位置
        DataManager.Instance.player.x=item.player.x
        DataManager.Instance.player.y=item.player.y
        DataManager.Instance.player.targetX=item.player.x
        DataManager.Instance.player.targetY=item.player.y
        DataManager.Instance.player.state=item.player.state
        DataManager.Instance.player.direction=item.player.direction
        DataManager.Instance.player.type=item.player.type
        //设置敌人位置
        for(let i=0;i<item.enemies.length;i++){
            DataManager.Instance.enemies[i].x=item.enemies[i].x
            DataManager.Instance.enemies[i].y=item.enemies[i].y
            DataManager.Instance.enemies[i].state=item.enemies[i].state
            DataManager.Instance.enemies[i].direction=item.enemies[i].direction
            DataManager.Instance.enemies[i].type=item.enemies[i].type
        }
        //设置门
        DataManager.Instance.door.x=item.door.x
        DataManager.Instance.door.y=item.door.y
        DataManager.Instance.door.state=item.door.state
        DataManager.Instance.door.direction=item.door.direction
        DataManager.Instance.door.type=item.door.type
        //设置陷阱
        for(let i=0;i<item.spikes.length;i++){
            DataManager.Instance.spikes[i].x=item.spikes[i].x
            DataManager.Instance.spikes[i].y=item.spikes[i].y
            DataManager.Instance.spikes[i].count=item.spikes[i].count
            DataManager.Instance.spikes[i].type=item.spikes[i].type
        //设置地裂
        for(let i=0;i<item.bursts.length;i++){
            DataManager.Instance.bursts[i].x=item.enemies[i].x
            DataManager.Instance.bursts[i].y=item.enemies[i].y
            DataManager.Instance.bursts[i].state=item.enemies[i].state
            DataManager.Instance.bursts[i].direction=item.enemies[i].direction
            DataManager.Instance.bursts[i].type=item.enemies[i].type
        }
    }

}
}
