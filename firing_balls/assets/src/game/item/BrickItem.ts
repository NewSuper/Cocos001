import GameModel from "../model/GameModel";
import { EventDispatch, Event_Name } from "../../common/event/EventDispatch";
import GameConst from "../GameConst";
import BallItem from "./BallItem";
import { AudioPlayer, AUDIO_CONFIG } from "../../common/audio/AudioPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrickItem extends cc.Component {

    @property(cc.Label)
    lb_hp: cc.Label = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    icon_hp_reduce: cc.Node = null;

    @property(cc.Node)
    icon_power: cc.Node = null;

    @property(cc.Integer)
    brick_type: number = 0;

    @property(cc.Integer)
    star_num: number = 0;

    @property(cc.Integer)
    ball_num: number = 0;

    @property(cc.Integer)
    effect_type: number = 0;

    @property(cc.Integer)
    brick_radius_mul: number = 1;

    private _hp = 1;
    public set hp(hp) {
        const lastHp = this._hp;
        this._hp = hp;
        if (hp <= 0) {
            if (lastHp > 0) {
                if (this.ball_num > 0) {
                    for (let index = 0; index < this.ball_num; index++) {
                        EventDispatch.ins().fire(Event_Name.GAME_CREATE_BALL)
                    }
                    AudioPlayer.ins().play_sound(AUDIO_CONFIG.Audio_balls);
                }
                if (this.star_num > 0) {
                    EventDispatch.ins().fire(Event_Name.GAME_STAR_GET_EFFECT, this.node.x, this.node.y, this.star_num);
                    GameModel.ins().ball_power += this.star_num;
                    AudioPlayer.ins().play_sound(AUDIO_CONFIG.Audio_star);
                }
                if (this.effect_type > 0) {
                    EventDispatch.ins().fire(Event_Name.GAME_POWER_TYPE_CHANGED, this.effect_type);
                }
                EventDispatch.ins().fire(Event_Name.GAME_PLAY_BRICK_REMOVE_EFFECT, this.node.x, this.node.y, this.icon_hp_reduce.color);
            }
            this.node.active = false;
        } else {
            this.lb_hp.string = `${hp > 1000000 ? Math.round(hp / 1000000) + 'M' : (hp > 1000 ? Math.round(hp / 1000) + 'K' : hp)}`;
            const theme_config = GameConst.ins().theme_config[0];
            if (theme_config) {
                this.icon_hp_reduce.color = this.icon.color = theme_config.color[Math.ceil(hp / this._color_hp) - 1] || theme_config.color[0];
            } else {
                this.icon_hp_reduce.color = this.icon.color = cc.Color.WHITE;
            }
            if (hp < lastHp) {
                if (this.icon_hp_reduce.getNumberOfRunningActions() <= 0) {
                    this.icon_hp_reduce.active = true;
                    this.icon_hp_reduce.opacity = 255;
                    this.icon_hp_reduce.runAction(cc.sequence(cc.blink(0.2, 1), cc.callFunc(() => {
                        if (this.icon_hp_reduce)
                            this.icon_hp_reduce.active = false;
                    })));
                }
            }
        }
    }
    public get hp() {
        return this._hp;
    }

    private _color_hp = 1;


    onLoad() {
        if (this.icon_power) {
            this.icon_power.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1, 1.2, 1.2), cc.scaleTo(1, 1, 1))));
        }
    }

    init(colors_num: number, hp: number) {
        const theme_config = GameConst.ins().theme_config[0];
        colors_num = colors_num > theme_config.color.length ? theme_config.color.length : colors_num;
        colors_num = colors_num > 0 ? colors_num : 1;
        this._color_hp = Math.ceil(hp / colors_num);
        this._hp = hp;
        this.hp = hp;

        this.icon_hp_reduce.active = false;
        this.icon_hp_reduce.stopAllActions();
    }

    reset() {
        this.node.stopAllActions();
        this.node.active = false;
    }

    update(dt) {
        if (this.lb_hp.node.angle !== -this.node.angle) {
            this.lb_hp.node.angle = -this.node.angle;
        }
    }

    onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        switch (otherCollider.tag) {
            case 100: {
                // 球
                let ballItem = otherCollider.node.getComponent(BallItem);
                if (ballItem && this.hp > 0) {
                    let power = GameModel.ins().ball_power * ballItem.power_scale;
                    power = power > this.hp ? this.hp : power;
                    this.hp -= power;
                    GameModel.ins().score += power;
                }
                break;
            }
        }
    }
}
