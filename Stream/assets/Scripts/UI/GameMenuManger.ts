import { _decorator, Component, Event, Node, RichText } from 'cc';
import { EventManager } from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM, MENU_ENUM } from '../../Enum';
import { DataManager } from '../Runtime/DataManager';
const { ccclass, property } = _decorator;

@ccclass('GameMenuManager')
export class GameMenuManager extends Component {
    @property({type:RichText})
    private text:RichText=null
    protected start(): void {
        EventManager.Instance.on(MENU_ENUM.NEXT_LEVEL,this.levelShow,this)
        EventManager.Instance.on(MENU_ENUM.LAST_LEVEL,this.levelShow,this)
    }
    protected onDestroy(): void {
        EventManager.Instance.off(MENU_ENUM.NEXT_LEVEL,this.levelShow)
        EventManager.Instance.off(MENU_ENUM.LAST_LEVEL,this.levelShow)
    }
    levelShow(){
        if(this.text){
            this.text.string=`level:${DataManager.Instance.levelIndex}`

        }
    }
    handerCtrl(event:Event,type:string){
        EventManager.Instance.emit(type)
    }
}
