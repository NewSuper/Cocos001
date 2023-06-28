import { Component, _decorator } from "cc";
import EventID from "./EventID";
import { IMessage } from "./IMessage";
import Message from "./Message";

const { ccclass, property } = _decorator;

@ccclass
export default class BaseSprite extends Component {

    private messageArray: any[] = [];

    protected onLoad() { }

    protected start() { }

    protected onDestroy() {
        this.removeMessage();
    }

    protected onEnable() { }
    protected onDisable() { }

    public addMessage(id: EventID, msgObj: IMessage): void {
        Message.instance.add(id, msgObj);
        this.messageArray.push([id, msgObj]);
    }

    public removeMessage() {
        if (this.messageArray) {
            for (var i: number = 0; i < this.messageArray.length; ++i) {
                if (this.messageArray[i][1] === this) {
                    Message.instance.remove(this.messageArray[i][0], this.messageArray[i][1]);
                }
            }
        }
    }
}