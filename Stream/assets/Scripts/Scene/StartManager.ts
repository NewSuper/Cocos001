import { _decorator, Component, director, Node, NodeEventType } from 'cc';
import { FaderManager } from '../Runtime/FaderManager';
import { SCEEN_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('StartManager')
export class StartManager extends Component {

    start() {

    }
    protected onLoad(): void {
        FaderManager.Instance.fadeOut(1500)
        this.node.once(Node.EventType.TOUCH_END,this.handleStart,this)
    }
    async  handleStart() {
        await FaderManager.Instance.fadeIn(1000)
        director.loadScene(SCEEN_ENUM.battle)
    }
    update(deltaTime: number) {

    }
}

