
import { _decorator, Component, Node, systemEvent, SystemEvent, EventTouch, Touch, quat, v3, Quat, game } from 'cc';
const { ccclass, property } = _decorator;

const temp_quat=quat();
const temp_v3=v3();

@ccclass('Controller')
export class Controller extends Component {

    isStart:boolean=false;
    
    onLoad(){
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE,this.onTouchMove,this);

        game.on('game-over',this.gameOver,this);
        game.on('game-win',this.gameOver,this);
    }

    start () {
        // [3]
    }

    onTouchMove(touch:Touch,event:EventTouch){
        if(!this.isStart){
            game.emit('start-touch');
            this.isStart=true;
        }
        temp_quat.set(this.node.rotation)
        temp_quat.getEulerAngles(temp_v3)
        temp_v3.y+=event.getDeltaX();
        Quat.fromEuler(temp_quat,0,temp_v3.y,0);
        this.node.setRotation(temp_quat);

        
    }

    gameOver(){
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE);
    }

    // update (deltaTime: number) {

    // }
}
