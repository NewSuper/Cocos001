import { _decorator, Component, Event, Node } from 'cc';
import { EventManager } from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
    handerCtrl(event:Event,type:string){
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL,type as (CONTROLLER_ENUM))
    }
}

