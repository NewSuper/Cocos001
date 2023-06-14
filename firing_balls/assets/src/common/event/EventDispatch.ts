import SingletonClass from "../base/SingletonClass";

export class EventDispatch extends SingletonClass {
    private listeners: any = {};          //Event_Name => cb[]

    static ins(): EventDispatch {
        return super.ins() as EventDispatch;
    }

    fire(event: Event_Name, ...params: any[]): void {
        let cbs: any[] = this.listeners[event];
        if (!cbs) {
            return;
        }
        for (let i: number = 0, len: number = cbs.length; i < len; i += 2) {
            let cb: any = cbs[i];
            let host: any = cbs[i + 1];
            if (cb)
                cb.call(host, ...params);
        }
    }

    add(event: Event_Name, cb: Function, host: any = null, callNow = false, ...params: any[]): void {
        let cbs: any[] = this.listeners[event];
        if (!cbs) {
            this.listeners[event] = cbs = [];
        }
        cbs.push(cb, host);
        if (callNow) {
            cb.call(host, ...params);
        }
    }

    remove(event: Event_Name, cb: Function) {
        let cbs: any[] = this.listeners[event];
        if (!cbs) {
            return;
        }
        let index: number = cbs.indexOf(cb);
        if (index < 0) {
            cc.warn(`EventDispatch remove ${event}, but cb not exists!`);
            return;
        }
        cbs.splice(index, 2);
    }

    clear() {
        for (let key in this.listeners) {
            this.listeners[key].length = 0;
        }
        this.listeners = {};
    }
}

/**事件名称定义*/
export enum Event_Name {
    GAME_TIME_CHANGED,
    GAME_CREATE_BALL,
    GAME_SCORE_CHANGED,
    GAME_BALL_POWER_CHANGED,
    GAME_BEST_SCORE_CHANGED,
    GAME_ON_TOUCH_MOVE,
    GAME_POWER_TYPE_CHANGED,
    GAME_RELIVE,
    GAME_PLAY_BRICK_REMOVE_EFFECT,
    SHOW_TIPS,
    GAME_STAR_GET_EFFECT,
}