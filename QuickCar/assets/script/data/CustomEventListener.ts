import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

interface IEventData {
    func: Function;
    target: any;
}

interface IEvent {
    [eventName: string]: IEventData[]; //当前事件名，多个事件回调
}

@ccclass('CustomEventListener')
export class CustomEventListener extends Component {
    public static handle: IEvent = {};
    
    /**
     * 监听
     * @param eventName 监听的事件
     * @param cb 回调函数
     * @param target 接收的对象 
     */
    public static on(eventName: string, cb:Function, target?: any){
        if(!this.handle[eventName]){ //如果当前事件处理器没有事件名
            this.handle[eventName] = [];
        }

        const data: IEventData = { func: cb, target };
        this.handle[eventName].push(data);
    }
    
    //取消监听
    public static off(eventName: string, cb: Function, target?: any){
        const list = this.handle[eventName];
        if(!list || list.length <=0){  //假如没注册过
            return;
        }

        for (let i = 0; i < list.length; i++) {
            const event = list[i];
            if(event.func === cb && (!target || target === event.target)){
                list.splice(i, 1);
                break;
            }
        }
    }
    
    //派发
    public static dispatchEvent (eventName: string, ...args:any){
        const list = this.handle[eventName];
        if (!list || list.length <= 0) {
            return;
        }

        for (let i = 0; i < list.length; i++) {
            const event = list[i];
            event.func.apply(event.target, args);
        }
    }
}


