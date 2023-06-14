import SingletonClass from "../../common/base/SingletonClass";
import { EventDispatch, Event_Name } from "../../common/event/EventDispatch";

export default class GameModel extends SingletonClass {
    static ins() {
        return super.ins() as GameModel;
    }

    private _fireBallDt = 2;
    public set fireBallDt(value) {
        value = value < 2 ? 2 : value;
        this._fireBallDt = value;
    }
    public get fireBallDt() {
        return this._fireBallDt;
    }

    private _ball_power = 1;
    public set ball_power(value) {
        const oldValue = this._ball_power
        value = value < 1 ? 1 : value;
        this._ball_power = value;
        EventDispatch.ins().fire(Event_Name.GAME_BALL_POWER_CHANGED, oldValue, value);
    }
    public get ball_power() {
        return this._ball_power;
    }

    private _ball_fire_speed = 2;
    public set ball_fire_speed(value) {
        value = value < 2 ? 2 : value;
        this._ball_fire_speed = value;
    }
    public get ball_fire_speed() {
  
        return this._ball_fire_speed;
    }

    private _ball_init_count = 4;
    public set ball_init_count(value) {
        value = value < 4 ? 4 : value;
        this._ball_init_count = value;
    }
    public get ball_init_count() {
  
        return this._ball_init_count;
    }

    private _score = 0;
    public set score(value) {
        value = value < 0 ? 0 : value;
        const oldValue = this._score;
        this._score = value;
        EventDispatch.ins().fire(Event_Name.GAME_SCORE_CHANGED, oldValue, value);
    }
    public get score() {
        return this._score;
    }

    private _revive_times = 0;
    public set revive_times(value) {
        value = value < 0 ? 0 : value;
        this._revive_times = value;
    }
    public get revive_times() {
        return this._revive_times;
    }

    public init() {
        this.reset();
    }

    public reset() {
        this.score = 0;
        this.revive_times = 0;
        this.ball_init_count =  4;
        this.ball_fire_speed =  1;
        this.ball_power = 1;
    }
}