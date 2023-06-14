import GameConst from "../GameConst";
import GameModel from "../model/GameModel";
import { load_plist_img } from "../../common/util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BallItem extends cc.Component {

    @property(cc.Integer)
    ball_type: number = 0;

    @property(cc.Sprite)
    ball_icon: cc.Sprite = null;

    private _ball_status: EnumBallStatus = 0;
    public get ball_status() {
        return this._ball_status;
    }
    public set ball_status(status) {
        this._ball_status = status;
        switch (status) {
            case EnumBallStatus.onLand: {
                this.scheduleOnce(() => {
                    if (this.node && this.node.active) {
                        this.node.setPosition(GameConst.ins().ball_init_x, GameConst.ins().ball_init_y);
                        this.ball_status = EnumBallStatus.onReady;
                    }
                }, 0)
                break;
            }
            case EnumBallStatus.onReady: {
                break;
            }
            case EnumBallStatus.onRemoved: {

                break;
            }
        }
    }

    private _power_scale: number = 1;
    public get power_scale() {
        return this._power_scale;
    }
    public set power_scale(value) {
        this._power_scale = value;
        this.ball_icon.node.setScale(value > 1 ? 1.5 : 1);
    }

    reset() {
        this.node.stopAllActions();
        this._ball_status = EnumBallStatus.onRemoved;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.power_scale = 1;
        this.node.active = false;
    }


    init(x: number, y: number, status: EnumBallStatus) {
        this.power_scale = 1;
        this.node.x = x;
        this.node.y = y;
        this.ball_status = status;

        load_plist_img(this.ball_icon, 'texture/plist/customize', `ball${0}`);
    }

    fireBall(fire_rotation: number) {
        const radians = fire_rotation * Math.PI / 180;
        const ball_speed = GameConst.ins().ball_speed + 100 * GameModel.ins().ball_fire_speed;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(Math.sin(radians) * ball_speed, Math.cos(radians) * ball_speed);
        this.ball_status = EnumBallStatus.onFire;
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        switch (otherCollider.tag) {
            case 1: {
                //底
                if (this.node.active) {
                    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                    this.ball_status = EnumBallStatus.onLand;
                }
                break;
            }
        }
    }
}

export enum EnumBallStatus {
    onReady = 0,
    onLand = 1,
    onFire = 2,
    onRemoved = 3
}