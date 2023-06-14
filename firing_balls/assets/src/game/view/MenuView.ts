import { POP_UI_BASE } from "../../common/ui/pop_ui_base";
import * as ui from "../../common/ui/pop_mgr";
import { EventDispatch, Event_Name } from "../../common/event/EventDispatch";
import { AudioPlayer, AUDIO_CONFIG } from "../../common/audio/AudioPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuView extends POP_UI_BASE {

    @property(cc.Node)
    node_title: cc.Node = null;

    @property(cc.Node)
    btn_play: cc.Node = null;

    @property(cc.Node)
    btn_share: cc.Node = null;

    @property(cc.Toggle)
    btn_sound: cc.Toggle = null;

    @property(cc.Toggle)
    btn_music: cc.Toggle = null;

    @property(cc.Node)
    guide_hand: cc.Node = null;


    @property([cc.Prefab])
    preload_prefabs: cc.Prefab[] = [];

    onLoad() {
        this.btn_play.on(cc.Node.EventType.TOUCH_START, this.playGame, this);
        this.btn_play.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.btn_share.on(cc.Node.EventType.TOUCH_END, this.share, this);

        const duration = 0.5;
        this.guide_hand.runAction(cc.repeatForever(cc.sequence(cc.moveBy(duration, 100, 0), cc.moveBy(duration, -100, 0), cc.moveBy(duration, -100, 0), cc.moveBy(duration, 100, 0))));
        const action = cc.repeatForever(cc.sequence(cc.scaleTo(duration, 1.2, 1.2), cc.scaleTo(duration, 1, 1)));
        this.btn_share.runAction(action.clone());
        this.node_title.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(duration, 5), cc.rotateTo(duration * 2, -5), cc.rotateTo(duration, 0), cc.delayTime(1))));

        AudioPlayer.ins().get_sound_mute() ? this.btn_sound.uncheck() : this.btn_sound.check();
        AudioPlayer.ins().get_music_mute() ? this.btn_music.check() : this.btn_music.uncheck();

        this.btn_sound.node.on('toggle', this.soundChange, this);
        this.btn_music.node.on('toggle', this.musicChange, this);
    }

    private soundChange() {
        const mute = !this.btn_sound.isChecked;
        AudioPlayer.ins().set_sound_mute(mute);
    }

    private musicChange() {
        const mute = this.btn_music.isChecked;
        AudioPlayer.ins().set_music_mute(mute);
    }

    private playGame() {
        ui.pop_mgr.get_inst().show(ui.UI_CONFIG.game);
        AudioPlayer.ins().play_sound(AUDIO_CONFIG.Audio_Btn);
    }

    private onTouchMove(param: cc.Event.EventTouch) {
        EventDispatch.ins().fire(Event_Name.GAME_ON_TOUCH_MOVE, param);
    }

    private share() {
        EventDispatch.ins().fire(Event_Name.SHOW_TIPS, '分享失败')
    }

    private openCustomizeView() {
        ui.pop_mgr.get_inst().show(ui.UI_CONFIG.customize);
    }
}
