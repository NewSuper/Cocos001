import { Component, _decorator } from "cc";
import EventID from "./EventID";
import HashMap from "./HashMap";
import { IMessage } from "./IMessage";

const { ccclass, property } = _decorator;

@ccclass("Message")
export default class Message extends Component {

    private static _instance: Message;
    //消息Map
    private msgMap: HashMap = new HashMap();
    start() {
        this.msgMap = new HashMap();
    }
    onEnable(): void {
        this.msgMap = new HashMap();
    }
    onLoad(): void {
        this.msgMap = new HashMap();
    }

    static get instance(): Message {
        if (!this._instance) {
            this._instance = new Message();
        }
        return this._instance;
    }

    /**
     * 添加监听
     * @param cmd 消息类型
     * @param msg 监听函数
     */
    add(cmd: EventID, msg: IMessage): void {
        var list: IMessage[] = this.msgMap.get(cmd);
        if (!list) {
            list = [];
            this.msgMap.put(cmd, list);
        }
        if (list.indexOf(msg) == -1) {
            list.push(msg);
        }
    }
    /**
     * 移除监听
     * @param cmd 消息类型
     * @param msg 监听函数
     */
    remove(cmd: EventID, msg: IMessage) {
        var list: IMessage[] = this.msgMap.get(cmd);
        if (list) {
            var len: number = list.length;
            for (var i = 0; i < len; i++) {
                if (list[i] == msg) {
                    list[i] = null;
                }
            }
        }
    }
    /**
     * 发送消息
     * @param cmd 消息类型
     * @param data 数据
     */
    send(cmd: EventID, data: any = null): void {
        var list: IMessage[] = this.msgMap.get(cmd);
        if (list) {
            var len: number = list.length;
            for (var i = 0; i < len;) {
                if (!list[i]) {
                    list.splice(i, 1);
                    len--;
                    continue;
                }
                list[i].recvMsg.call(list[i], cmd, data);
                i++;
            }
            if (len <= 0) {
                this.msgMap.remove(cmd);
            }
        }
    }
}
