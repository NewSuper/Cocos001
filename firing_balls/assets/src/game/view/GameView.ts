import { POP_UI_BASE } from "../../common/ui/pop_ui_base";
import BallItem, { EnumBallStatus } from "../item/BallItem";
import GameConst from "../GameConst";
import GameModel from "../model/GameModel";
import BrickItem from "../item/BrickItem";
import { RandomUtil } from "../../common/random/RandomUtil";
import { EventDispatch, Event_Name } from "../../common/event/EventDispatch";
import * as ui from "../../common/ui/pop_mgr";
import { AudioPlayer, AUDIO_CONFIG } from "../../common/audio/AudioPlayer";
import { gen_handler } from "../../common/util";
import { loader_mgr } from "../../common/loader/loader_mgr";
import { Tween, Ease } from "../../common/tween/Tween";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends POP_UI_BASE {
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    node_top: cc.Node = null;
    @property(cc.Node)
    cannon_head: cc.Node = null;
    @property(cc.Node)
    node_physics: cc.Node = null;
    @property(cc.Label)
    lb_ball_count: cc.Label = null;
    @property(cc.Label)
    lb_ball_power: cc.Label = null;
    @property(cc.Node)
    guide_hand: cc.Node = null;
    @property(cc.Node)
    node_freeze: cc.Node = null;

    @property(cc.Label)
    lb_score: cc.Label = null;
    @property(cc.Node)
    node_power_progress: cc.Node = null;
    @property([cc.Node])
    power_txts: cc.Node[] = [];

    @property(cc.ParticleSystem)
    particleSystem: cc.ParticleSystem = null;

    @property([cc.Prefab])
    balls_ins: cc.Prefab[] = [];
    @property([cc.Prefab])
    bricks_ins: cc.Prefab[] = [];

    @property(cc.Node)
    node_star_img: cc.Node = null;

    @property(cc.Prefab)
    star_ins: cc.Prefab = null;
    private _star_pool: cc.Node[] = [];
    private _star_num = 0;

    private balls_pool: cc.Node[][] = [];
    private bricks_pool: cc.Node[][] = [];

    private balls_in_game: BallItem[] = [];
    private bricks_in_game: BrickItem[] = [];

    private _updateDt: number = 0;
    private _brick_speed: number = 1;
    private _moved_length = 0;
    private _moved_level = 0;
    private _power_type = 0;
    private _isGameOver = false;

    onLoad() {
        this.bg.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        for (let i = 0, len = this.balls_ins.length; i < len;) {
            this.balls_pool[i++] = [];
        }

        for (let i = 0, len = this.bricks_ins.length; i < len;) {
            this.bricks_pool[i++] = [];
        }
        cc.director.getPhysicsManager().enabledAccumulator = true;
    }

    private onTouchMove(param: cc.Event.EventTouch) {
        const deltaX = param.getDeltaX();
        const deltaY = param.getDeltaY();
        const deltaR = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.3;
        const sign = Math.sign(deltaX);
        // 2.1.0 后改 rotation --> -angle
        let angle = -this.cannon_head.angle + deltaR * sign;
        angle = Math.abs(angle) >= 85 ? Math.sign(angle) * 85 : angle;
        this.cannon_head.angle = -angle;
    }

    update(dt) {
        if (this._isGameOver) {
            return;
        }

        //power type
        if (this._power_type > 0) {
            this.node_power_progress.width -= 1.5;
            if (this.node_power_progress.active && this.node_power_progress.width <= 0) {
                this.updateGamePowerType(0);
            }
            switch (this._power_type) {
                case 3: {
                    this._brick_speed = 0;
                    break;
                }
            }
        }

        this._updateDt++;
        this._moved_length += this._brick_speed;

        //fire ball
        if (this._updateDt % GameModel.ins().fireBallDt === 0 || this._power_type === 2) {
            this.balls_in_game.some((item) => {
                if ((item.ball_status === EnumBallStatus.onReady) && (item.ball_type === 0 || this._power_type === 2)) {
                    item.power_scale = this._power_type === 1 ? 2 : 1;
                    item.fireBall(-this.cannon_head.angle);
                    return true;
                }
                return false;
            })
        }

        //add bricks
        const brick_radius = GameConst.ins().brick_radius;
        const ball_power = GameModel.ins().ball_power;
        const new_level = Math.floor(this._moved_length / 4 / brick_radius);
        if (new_level > this._moved_level) {
            this._moved_level++;
            let balls_in_game_length = this.balls_in_game.length / (this._power_type === 2 ? 2 : 1);
            const maxHp = Math.ceil(balls_in_game_length * ball_power * 0.5 + this._moved_level * ball_power * 1.2);
            const brick_type_percent = GameConst.ins().brick_type_percent;
            let big_j = -999;
            let item_i = -999, item_j = -999;
            if (this._moved_level % 12 === 0) {
                //big
                big_j = RandomUtil.ins().randomNum(-2, 3);
                this.createBrick(-brick_radius + big_j * brick_radius * 2 + GameConst.ins().brick_init_x, brick_radius + GameConst.ins().brick_init_y,
                    RandomUtil.ins().randomNum(maxHp * 3, maxHp * 6),
                    RandomUtil.ins().randomNum(14, 16),
                    10);
            }
            if (this._moved_level % 11 === 0) {
                //道具
                item_i = RandomUtil.ins().randomNum(0, 1);
                item_j = RandomUtil.ins().randomNum(-3, 3);
            }
            for (let i = 0; i < 2; i++) {
                for (let j = -3; j < 4; j++) {
                    if (j === big_j || j === big_j - 1) {
                        //big
                    } else {
                        let hp = (i === item_i && j === item_j) ? RandomUtil.ins().randomNum(ball_power, Math.ceil(maxHp / 2)) : RandomUtil.ins().randomNum(-Math.round(maxHp / (this._moved_level % 5 + 1)), maxHp);
                        let brick_type = (i === item_i && j === item_j) ? RandomUtil.ins().randomNum(11, 13) : (brick_type_percent[RandomUtil.ins().randomNum(0, brick_type_percent.length - 1)]);
                        if (hp >= ball_power) {
                            this.createBrick(j * brick_radius * 2 + GameConst.ins().brick_init_x, i * brick_radius * 2 + GameConst.ins().brick_init_y,
                                hp,
                                brick_type,
                                Math.ceil(hp * 10 / maxHp));
                        }
                    }
                }
            }
        }

        //update bricks
        let brick_min_y = 9999;
        for (let index = 0, len = this.bricks_in_game.length; index < len; index++) {
            const element = this.bricks_in_game[index];
            if (element && element.node) {
                const brick = element.node;
                if (element.hp <= 0 || !brick.active) {
                    //remove
                    if (this._updateDt % 60 === 0) {
                        element.reset();
                        this.bricks_in_game.splice(index, 1);
                        this.bricks_pool[element.brick_type].push(brick);
                        index--;
                    }
                } else {
                    //update pos
                    brick.y -= this._brick_speed;
                    if (brick.y - element.brick_radius_mul * brick_radius <= GameConst.ins().ball_init_y) {
                        this.gameOver();
                        return;
                    }
                    if (brick.y < brick_min_y) {
                        brick_min_y = brick.y;
                    }
                }
            }
        }
        this._brick_speed = (brick_min_y > GameConst.ins().ball_init_y + brick_radius * 7) ? 1 : ((brick_min_y > GameConst.ins().ball_init_y + brick_radius * 5) ? 0.9 : 0.6);
    }

    // 创建小球
    private createBall(x = GameConst.ins().ball_init_x, y = GameConst.ins().ball_init_y, status = EnumBallStatus.onReady, ball_type = 0) {
        let ball = this.balls_pool[ball_type].shift();
        if (!ball) {
            ball = cc.instantiate(this.balls_ins[ball_type]);
            this.node_physics.addChild(ball);
        }
        const item = ball.getComponent(BallItem);
        item.init(x, y, status);
        ball.active = true;
        this.balls_in_game.unshift(item);
        this.lb_ball_count.string = `${this.balls_in_game.length / 2}`;
        if (ball_type === 0) {
            this.createBall(GameConst.ins().ball_init_x, GameConst.ins().ball_init_y, EnumBallStatus.onReady, 1);
        }
    }

    //创建砖块
    private createBrick(x = GameConst.ins().brick_init_x, y = GameConst.ins().brick_init_y, hp = 1, brick_type = 0, colors_num = 1) {
        if (brick_type === 7 && this.balls_in_game.length > 200) {
            brick_type = 0;
        }
        let brick = this.bricks_pool[brick_type].shift();
        if (!brick) {
            brick = cc.instantiate(this.bricks_ins[brick_type]);
            this.node_physics.addChild(brick);
        }
        const item = brick.getComponent(BrickItem);
        brick.active = true;
        brick.x = x;
        brick.y = y;
        item.init(colors_num, hp);
        this.bricks_in_game.push(item);
    }

    private resetGame() {
        this.node_physics.active = true;
        this.cannon_head.angle = 10 - Math.random() * 20;
        cc.director.getPhysicsManager().enabled = true;
        this._updateDt = 0;
        this._moved_length = 0;
        this._moved_level = 0;
        this._isGameOver = false;
        this.updateGamePowerType(0);
        GameModel.ins().reset();
        const ball_init_count = GameModel.ins().ball_init_count;
        for (let index = 0; index < ball_init_count; index++) {
            this.createBall();
        }
        const brick_radius = GameConst.ins().brick_radius;
        for (let i = 0; i < 2; i++) {
            for (let j = -3; j < 4; j++) {
                let hp = (i + 1) * GameModel.ins().ball_power + (ball_init_count - 4);
                hp = hp < 0 ? 1 : hp;
                this.createBrick(j * brick_radius * 2 + GameConst.ins().brick_init_x, i * brick_radius * 2 + GameConst.ins().brick_init_y, hp);
            }
        }

        this._star_num = GameModel.ins().ball_power;
        this.lb_ball_power.string = `${this._star_num}`;
    }

    private clearGame() {
        this.node_physics.active = false;
        cc.director.getPhysicsManager().enabled = false;
        this.balls_in_game.forEach((value) => {
            value.reset();
            this.balls_pool[value.ball_type].push(value.node);
        })
        this.balls_in_game = [];
        this.bricks_in_game.forEach((value) => {
            value.reset();
            this.bricks_pool[value.brick_type].push(value.node);
        })
        this.bricks_in_game = [];
        GameModel.ins().reset();
    }

    private updateScore(old?: number, newValue?: number) {
        const score = GameModel.ins().score;
        this.lb_score.string = `${score}`;
    }

    private updateBallPower(old?: number, newValue?: number) {
        const ball_power = GameModel.ins().ball_power;
        // this.lb_ball_power.string = `${ball_power}`;
    }

    //星星特效
    private updateStarNumGetEffect(x: number, y: number, count: number) {
        const targetPos = this.node_top.convertToNodeSpaceAR(this.node_star_img.convertToWorldSpaceAR(cc.v2(0, 0)));
        for (let index = 0; index < count; index++) {
            let star_item = this._star_pool.shift();
            if (!star_item) {
                star_item = cc.instantiate(this.star_ins);
                this.node_top.addChild(star_item);
            }
            star_item.x = x;
            star_item.y = y;
            star_item.angle = 0;
            star_item.active = true;
            Tween.get(star_item).to({ angle: 720, x: targetPos.x, y: targetPos.y }, 800 + 100 * index, Ease.getBackInOut(1.2)).call(() => {
                star_item.active = false;
                this._star_pool.push(star_item);
                Tween.get(this.node_star_img).to({ scale: 1.2 }, 300).to({ scale: 1 }, 300, Ease.backInOut).call(() => {
                    this._star_num += 1;
                    this.lb_ball_power.string = `${this._star_num}`;
                })
            })
        }
    }

    //砖块消除特效
    private _brick_img_pool: cc.Node[] = [];
    private playBrickDeleteEffect(x: number, y: number, color: cc.Color) {
        const theme_cfg = GameConst.ins().theme_config[0];
        if (theme_cfg) {
            loader_mgr.get_inst().loadAsset('texture/plist/customize', gen_handler((res: cc.SpriteAtlas) => {
                const spriteFrame = res.getSpriteFrame(theme_cfg.theme);
                if (spriteFrame) {
                    for (let index = 0; index < 9; index++) {
                        const i = index % 3 - 1.5;
                        const j = Math.floor(index / 3) - 1.5;
                        const targetPosX = x + i * (100 + 150 * Math.random());
                        const targetPosY = y + j * (100 + 150 * Math.random());
                        let img = this._brick_img_pool.shift();
                        if (!img) {
                            img = new cc.Node();
                            img.addComponent(cc.Sprite);
                            this.node_physics.addChild(img);
                        }
                        img.active = true;
                        img.angle = 0;
                        img.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        img.color = color;
                        const size = Math.random() * 50 + 50;
                        img.width = img.height = size;
                        img.x = x;
                        img.y = y;
                        Tween.get(img).to({ x: targetPosX, y: targetPosY, width: size / 3, height: size / 3, angle: 1000 * Math.random() }, Math.random() * 500 + 500).call(() => {
                            img.active = false;
                            this._brick_img_pool.push(img);
                        })
                    }
                } else {
                }
            }), cc.SpriteAtlas);
        }
    }

    //道具效果
    private updateGamePowerType(power = 0) {
        if (power > 0) {
            if (this._power_type === 0) {
                this.node_power_progress.active = true;
                this.node_power_progress.width = 640;
                this._power_type = power;
                switch (power) {
                    case 2: {
                        this.cannon_head.scale = 2;
                        break;
                    }
                    case 3: {
                        this.node_freeze.active = true;
                        break;
                    }
                }
                this.lb_ball_count.node.color = this.node_power_progress.color = [cc.Color.WHITE, cc.Color.RED, cc.Color.YELLOW, cc.Color.GRAY][power] || cc.Color.WHITE;

                const power_txt = this.power_txts[power];
                if (power_txt) {
                    power_txt.active = true;
                    power_txt.stopAllActions();
                    power_txt.opacity = 0;
                    const moveY = 100;
                    power_txt.runAction(cc.sequence(cc.fadeIn(1), cc.moveBy(0.5, 0, moveY), cc.delayTime(0.5), cc.fadeOut(1), cc.callFunc(() => {
                        if (power_txt) {
                            power_txt.y -= moveY;
                            power_txt.active = false;
                        }
                    })))
                }
                AudioPlayer.ins().play_sound(AUDIO_CONFIG.Audio_levelup);
            }
        } else {
            this.node_freeze.active = this.node_power_progress.active = false;
            this.node_power_progress.width = 640;
            this.lb_ball_count.node.color = cc.Color.WHITE;
            this.cannon_head.scale = 1;

            switch (this._power_type) {
                case 1: {
                    break;
                }
                case 2: {

                    break;
                }
            }
            this._power_type = power;
        }
    }

    private gameRelive() {
        GameModel.ins().revive_times++;
        this.bricks_in_game.forEach((value) => {
            value.reset();
            this.bricks_pool[value.brick_type].push(value.node);
        })
        this.bricks_in_game = [];
        this._isGameOver = false;
        cc.director.getPhysicsManager().enabled = true;
        AudioPlayer.ins().play_music(AUDIO_CONFIG.Audio_Bgm);
    }

    private gameOver() {
        this._isGameOver = true;
        cc.director.getPhysicsManager().enabled = false;
        ui.pop_mgr.get_inst().show(ui.UI_CONFIG.result);
    }

    on_show() {
        super.on_show();

        EventDispatch.ins().add(Event_Name.GAME_CREATE_BALL, this.createBall, this);
        EventDispatch.ins().add(Event_Name.GAME_RELIVE, this.gameRelive, this);
        EventDispatch.ins().add(Event_Name.GAME_ON_TOUCH_MOVE, this.onTouchMove, this);
        EventDispatch.ins().add(Event_Name.GAME_POWER_TYPE_CHANGED, this.updateGamePowerType, this);
        EventDispatch.ins().add(Event_Name.GAME_SCORE_CHANGED, this.updateScore, this, true);
        EventDispatch.ins().add(Event_Name.GAME_BALL_POWER_CHANGED, this.updateBallPower, this, true);
        EventDispatch.ins().add(Event_Name.GAME_PLAY_BRICK_REMOVE_EFFECT, this.playBrickDeleteEffect, this);
        EventDispatch.ins().add(Event_Name.GAME_STAR_GET_EFFECT, this.updateStarNumGetEffect, this);
        AudioPlayer.ins().play_music(AUDIO_CONFIG.Audio_Bgm);

        const duration = 0.5;
        this.guide_hand.active = true;
        this.guide_hand.stopAllActions();
        this.guide_hand.runAction(cc.sequence(cc.repeat(cc.sequence(cc.moveBy(duration, 100, 0), cc.moveBy(duration, -100, 0), cc.moveBy(duration, -100, 0), cc.moveBy(duration, 100, 0)), 5), cc.callFunc(() => {
            if (this.guide_hand)
                this.guide_hand.active = false;
        })));

        this.btn_close.node.active = false;
        setTimeout(() => {
            this.btn_close.node.active = true;
        }, 5000);

        this.resetGame();
    }

    onCloseBtnTouch() {
        super.onCloseBtnTouch();
    }

    on_hide() {
        EventDispatch.ins().remove(Event_Name.GAME_CREATE_BALL, this.createBall);
        EventDispatch.ins().remove(Event_Name.GAME_RELIVE, this.gameRelive);
        EventDispatch.ins().remove(Event_Name.GAME_ON_TOUCH_MOVE, this.onTouchMove);
        EventDispatch.ins().remove(Event_Name.GAME_POWER_TYPE_CHANGED, this.updateGamePowerType);
        EventDispatch.ins().remove(Event_Name.GAME_SCORE_CHANGED, this.updateScore);
        EventDispatch.ins().remove(Event_Name.GAME_PLAY_BRICK_REMOVE_EFFECT, this.playBrickDeleteEffect);
        EventDispatch.ins().remove(Event_Name.GAME_STAR_GET_EFFECT, this.updateStarNumGetEffect);
        AudioPlayer.ins().stop_music();
        this.guide_hand.stopAllActions();

        this.clearGame();
        super.on_hide();
    }
}

// https://github.com/baiyuwubing/firing_balls

// qq 交流群 859642112