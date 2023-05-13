import { _decorator, BlockInputEvents, Color, Component, Event, game, Graphics, Node,UITransform,Vec3,view } from 'cc';
import { EventManager } from '../Runtime/EventManager';
import { DIRECTION_ENUM, EVENT_ENUM } from '../../Enum';

const { ccclass, property } = _decorator;
@ccclass('ShakeManager')
export class ShakeManager extends Component {
    private isShaking:boolean=false
    private oldTime:number=0
    private oldPosition:{x:number,y:number}={x:0,y:0}
    protected direction:DIRECTION_ENUM=DIRECTION_ENUM.BOTTOM

    init(){
        EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE,this.onShake,this)
    }
    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE,this.onShake)
    }
    onShake(direction:DIRECTION_ENUM=DIRECTION_ENUM.BOTTOM){
        if(this.isShaking){
            return
        }
        this.oldTime=game.totalTime
        this.oldPosition={x:this.node.position.x,y:this.node.position.y}
        this.direction=direction
        this.isShaking=true
    }
    protected update(dt: number): void {
        if(this.isShaking){
            const amount=1
            const frequency=12
            const offsetTime=(game.totalTime-this.oldTime)/1000
            const offset=amount*Math.sin(frequency*offsetTime*Math.PI)
            if(offsetTime>0.5){
                this.node.setPosition(this.oldPosition.x,this.oldPosition.y)
                this.isShaking=false
            }else{
                switch(this.direction){
                    case(DIRECTION_ENUM.BOTTOM):
                    this.node.setPosition(this.oldPosition.x,this.oldPosition.y-offset)
                    break
                    case(DIRECTION_ENUM.TOP):
                    this.node.setPosition(this.oldPosition.x,this.oldPosition.y+offset)
                    break
                    case(DIRECTION_ENUM.LEFT):
                    this.node.setPosition(this.oldPosition.x+offset,this.oldPosition.y)
                    break
                    case(DIRECTION_ENUM.RIGHT):
                    this.node.setPosition(this.oldPosition.x-offset,this.oldPosition.y)
                    break
                }
            }

        }
    }
}
