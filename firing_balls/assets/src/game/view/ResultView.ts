// author : lamyoung
import * as ui from "../../common/ui/pop_mgr";
import { POP_UI_BASE } from "../../common/ui/pop_ui_base";
import GameModel from "../model/GameModel";
import { AudioPlayer, AUDIO_CONFIG } from "../../common/audio/AudioPlayer";
import { EventDispatch, Event_Name } from "../../common/event/EventDispatch";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultView extends POP_UI_BASE {
    constructor() {
        super();
    }
    @property(cc.Node)
    btn_reset: cc.Node = null;
    @property(cc.Node)
    btn_revive: cc.Node = null;
    @property(cc.Node)
    btn_revive_back: cc.Node = null;
    @property(cc.Label)
    lb_revive_count: cc.Label = null;
    @property(cc.Node)
    node_no_revive: cc.Node = null;
    @property(cc.Node)
    node_revive: cc.Node = null;
    @property(cc.Node)
    btn_share: cc.Node = null;
    @property(cc.Label)
    lb_score: cc.Label = null;

    private _sound: string[] = [AUDIO_CONFIG.Audio_gameover, AUDIO_CONFIG.Audio_win, AUDIO_CONFIG.Audio_congra]

    onLoad() {
        this.btn_reset.on(cc.Node.EventType.TOUCH_END, this.backToMenu, this);
        this.btn_revive.on(cc.Node.EventType.TOUCH_END, this.gameRevive, this);
        this.btn_revive_back.on(cc.Node.EventType.TOUCH_END, this.closeGameRevive, this);
        this.btn_share.on(cc.Node.EventType.TOUCH_END, this.share, this);
        const action = cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.2, 1.2), cc.scaleTo(0.5, 1, 1)));
        this.btn_revive.runAction(action);
        this.btn_share.runAction(action.clone());
    }

    private backToMenu() {
        this.onCloseBtnTouch();
        ui.pop_mgr.get_inst().hide(ui.UI_CONFIG.game);
    }

    private share() {
        EventDispatch.ins().fire(Event_Name.SHOW_TIPS, '分享失败')
    }

    private closeGameRevive() {
        this.updateCanRevive(false);
    }

    private gameRevive() {
        EventDispatch.ins().fire(Event_Name.GAME_RELIVE);
        this.onCloseBtnTouch();
    }

    private _autoReviveCount = 10;
    private updateCanRevive(canRevive: boolean) {
        this.node_revive.active = canRevive;
        this.node_no_revive.active = !canRevive;
        if (canRevive) {
            this._autoReviveCount = 10;
            this.autoReviveCountFn();
            this.schedule(this.autoReviveCountFn, 1, this._autoReviveCount + 1, 0);
        } else {
            this.unschedule(this.autoReviveCountFn);
        }
    }

    private autoReviveCountFn() {
        this._autoReviveCount--;
        this.lb_revive_count.string = `${this._autoReviveCount}`;
        if (this._autoReviveCount <= 0) {
            this.closeGameRevive();
        }
    }

    on_show() {
        super.on_show();
        const score = GameModel.ins().score;
        const bestScore = GameModel.ins().bestScore;
        if (score > bestScore) {
            GameModel.ins().bestScore = score;
        }

        this.lb_score.string = `${score}`;
        AudioPlayer.ins().play_sound(this._sound[Math.floor(Math.random() * this._sound.length)] || this._sound[0]);

        if (GameModel.ins().revive_times < 1) {
            this.updateCanRevive(true);
        } else {
            this.updateCanRevive(false);
        }
    }

    on_hide() {
        super.on_hide();
    }
}
