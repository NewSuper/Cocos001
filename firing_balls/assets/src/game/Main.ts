import * as ui from "../common/ui/pop_mgr";
import { TimerMgr } from "../common/timer/timer_mgr";
import { RandomUtil } from "../common/random/RandomUtil";
import GameModel from "./model/GameModel";
import { AudioPlayer } from "../common/audio/AudioPlayer";
import { EventDispatch, Event_Name } from "../common/event/EventDispatch";
import { Tween } from "../common/tween/Tween";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    @property(cc.Label)
    lb_loading: cc.Label = null;
    @property(cc.Node)
    node_loading: cc.Node = null;
    @property(cc.Node)
    bg_tips: cc.Node = null;
    @property(cc.Label)
    lb_tips: cc.Label = null;
    @property(cc.Node)
    top_layer: cc.Node = null;

    onLoad() {
        RandomUtil.ins().init(Math.round(1000000 + Math.random() * 8999999).toString());
        EventDispatch.ins().add(Event_Name.SHOW_TIPS, this.showTips, this);
        this.lb_tips.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
            this.bg_tips.width = this.lb_tips.node.width + 10;
            this.bg_tips.height = this.lb_tips.node.height + 10;
        });
        this.node_loading.runAction(cc.repeatForever(cc.sequence(
            cc.callFunc(() => {
                this.node_loading.scaleX = 1;
            }), cc.moveBy(3, -1200, 0),
            cc.callFunc(() => {
                this.node_loading.scaleX = -1;
            })
            , cc.moveBy(3, 1200, 0)
        )))

        AudioPlayer.ins().init();
        GameModel.ins().init();
        ui.pop_mgr.get_inst().show(ui.UI_CONFIG.menu);
    }

    private showTips(str: string) {
            Tween.removeTweens(this.bg_tips);
            this.lb_tips.string = str;
            this.bg_tips.opacity = 255;
            this.bg_tips.active = true;

            Tween.get(this.bg_tips).wait(2000).to({ opacity: 0 }, 2000).call(() => {
                this.bg_tips.active = false;
            })
    }

    update(dt: number) {
        TimerMgr.getInst().update(dt);
    }
}

// 欢迎关注【白玉无冰】公众号