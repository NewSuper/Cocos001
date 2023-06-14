import { pool_mgr } from "../pool/pool_mgr"
import { handler, gen_handler } from "../util"
import { POP_UI_BASE } from "./pop_ui_base"
import { TimerMgr } from "../timer/timer_mgr"
import * as utils from '../util'
import { Tween } from "../tween/Tween";

export class pop_mgr {
    private static inst: pop_mgr;
    private ui_cache: any;           //path => pop_ui
    private ui_stack: Array<string>; //ui stacks
    private ui_show_handler: handler;
    private ui_hide_handler: handler;

    private constructor() {
        this.ui_cache = {};
        this.ui_stack = new Array<string>();
    }

    static get_inst(): pop_mgr {
        if (!this.inst) {
            this.inst = new pop_mgr();
        }
        return this.inst;
    }

    private get_ui(path: string): pop_ui {
        let ui: pop_ui = this.ui_cache[path];
        if (!ui) {
            this.ui_cache[path] = ui = { node: null, is_show: false };
        }
        return ui;
    }

    clear() {
        for (let path in this.ui_cache) {
            this.hide(path);
        }
        this.ui_cache = {};
        this.ui_stack.length = 0;
    }

    peek() {
        return this.ui_stack[this.ui_stack.length - 1];
    }

    set_handlers(on_ui_show: handler, on_ui_hide: handler) {
        this.ui_show_handler = on_ui_show;
        this.ui_hide_handler = on_ui_hide;
    }

    is_show(path: string): boolean {
        let ui: pop_ui = this.ui_cache[path];
        return ui != null;
    }

    show(path: string, transition?: UI_TRANSITION, ...params: any[]): void {
        let ui: pop_ui = this.get_ui(path);
        if (ui.is_show) {
            return;
        }
        ui.is_show = true;
        pool_mgr.get_inst().get_ui(path, gen_handler((node: cc.Node): void => {
            if (!ui.is_show) {
                pool_mgr.get_inst().put_ui(path, node);
                return;
            }
            ui.node = node;
            //应用过渡效果
            this.applyTransitionEffect(node, transition);
            cc.director.getScene().getChildByName('Canvas').getChildByName('mid_layer').addChild(node);
            TimerMgr.getInst().once(0, utils.gen_handler(() => {
                //在加到场景同一帧调用界面show方法，计算位置会不准确，故统一在下一帧调用show
                if (!ui.is_show) {
                    return;
                }
                let ui_base = node.getComponent(POP_UI_BASE) as POP_UI_BASE;
                ui_base.ui_name = path;
                ui_base.__show__(...params);
                //进栈
                this.ui_stack.push(path);
                //钩子函数调用
                if (this.ui_show_handler) {
                    this.ui_show_handler.exec();
                }
            }));
        }, this));
    }

    //关闭界面时不destroy，只是从父节点移除并缓存
    hide(path: string): void {
        let ui: pop_ui = this.ui_cache[path];
        if (!ui) {
            return;
        }
        this.ui_cache[path] = null;
        ui.is_show = false;
        if (ui.node) {
            pool_mgr.get_inst().put_ui(path, ui.node);
            //调用hide
            let ui_base = ui.node.getComponent(POP_UI_BASE) as POP_UI_BASE;
            ui_base.__hide__();
            //出栈
            const lastIdx = this.ui_stack.lastIndexOf(path);
            if (lastIdx != -1) {
                this.ui_stack.splice(lastIdx, 1);
            }
            //钩子函数调用
            if (this.ui_hide_handler) {
                this.ui_hide_handler.exec();
            }
        }
    }

    applyTransitionEffect(node: cc.Node, transition: UI_TRANSITION) {
        if (transition && transition.transType == UI_TRANSITION_TYPE.None) {
            return;
        }
        transition = transition || {
            transType: UI_TRANSITION_TYPE.FadeIn,
            duration: 500,
        };
        switch (transition.transType) {
            case UI_TRANSITION_TYPE.FadeIn:
                Tween.removeTweens(node);
                node.opacity = 0;
                Tween.get(node).to({ opacity: 255 }, transition.duration);
                break;
        }
    }
}

type pop_ui = {
    node: cc.Node;
    is_show: boolean;
}

//界面prefab路径配置, 相对于assets/resources目录
export const UI_CONFIG = {
    overlay_bg: "prefab/panels/panel_overlay_bg",

    game: "prefab/view/game",
    upgrade: "prefab/view/upgrade",
    rank: "prefab/view/rank",
    customize: "prefab/view/customize",

    result: "prefab/view/result",
    menu: 'prefab/view/menu',
}

interface UI_TRANSITION {
    transType: UI_TRANSITION_TYPE;
    tweenFunc?: Function;
    duration?: number;
}

export const enum UI_TRANSITION_TYPE {
    None = 1,
    FadeIn,
    DropDown,
    PopUp,
    LeftIn,
    RightIn,
}