"use strict";
cc._RF.push(module, '505e66hsWJGOICpiV35xWvB', 'Game');
// scripts/Game.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./Player");
var ScoreAnimator_1 = require("./ScoreAnimator");
var Star_1 = require("./Star");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameManager = /** @class */ (function (_super) {
    __extends(GameManager, _super);
    function GameManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.starPrefab = null;
        _this.animRootPrefab = null;
        _this.maxStarDuration = 0;
        _this.minStarDuration = 0;
        _this.ground = null;
        _this.player = null;
        _this.btnNode = null;
        _this.gameOverNode = null;
        _this.scoreDisplay = null;
        _this.scoreAudio = null;
        _this.groundY = 0;
        _this.currentStar = null;
        _this.currentAnimRoot = null;
        _this.timer = 0;
        _this.starDuration = 0;
        return _this;
    }
    GameManager.prototype.onLoad = function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // store last star's x position
        this.currentStar = null;
        this.currentAnimRoot = null;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // is showing menu or running game
        this.enabled = false;
        // initialize star and score pool
        this.starPool = new cc.NodePool("Star");
        this.scorePool = new cc.NodePool("ScoreAnim");
    };
    GameManager.prototype.start = function () { };
    // update (dt) {}
    GameManager.prototype.onStartGame = function () {
        // 初始化计分
        this.score = 0;
        this.scoreDisplay.string = "Score: " + this.score.toString();
        // set game state to running
        this.enabled = true;
        // set button and gameover text out of screen
        this.btnNode.x = 3000;
        // "Game Over" not visible
        this.gameOverNode.active = false;
        // reset player position and move speed
        this.player.getComponent(Player_1.default).startMoveAt(cc.v2(0, this.groundY));
        // spawn star
        this.spawnNewStar();
    };
    GameManager.prototype.spawnNewStar = function () {
        var newStar = null;
        // 使用给定的模板在场景中生成一个新节点
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this); // this will be passed to Star's reuse method
        }
        else {
            newStar = cc.instantiate(this.starPrefab);
            // pass Game instance to star
            newStar.getComponent(Star_1.default).reuse(this);
        }
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration =
            this.minStarDuration +
                Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
        this.currentStar = newStar;
    };
    GameManager.prototype.getNewStarPosition = function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY +
            Math.random() * this.player.getComponent(Player_1.default).jumpHeight +
            50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    };
    GameManager.prototype.despawnStar = function (star) {
        this.starPool.put(star);
        this.spawnNewStar();
    };
    GameManager.prototype.spawnAnimRoot = function () {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get(this);
        }
        else {
            fx = cc.instantiate(this.animRootPrefab);
            fx.getComponent(ScoreAnimator_1.default).reuse(this);
        }
        return fx;
    };
    GameManager.prototype.despawnAnimRoot = function () {
        this.scorePool.put(this.currentAnimRoot);
    };
    GameManager.prototype.gameOver = function () {
        this.gameOverNode.active = true;
        this.btnNode.x = 0;
        this.player.getComponent(Player_1.default).enabled = false;
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        this.currentStar.destroy();
    };
    GameManager.prototype.update = function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false; // disable gameOver logic to avoid load scene repeatedly
            return;
        }
        this.timer += dt;
    };
    GameManager.prototype.gainScore = function (pos) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = "Score: " + this.score;
        // 播放特效
        this.currentAnimRoot = this.spawnAnimRoot();
        this.node.addChild(this.currentAnimRoot);
        this.currentAnimRoot.position = pos;
        this.currentAnimRoot.getComponent(cc.Animation).play("score_pop");
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    };
    __decorate([
        property(cc.Prefab)
    ], GameManager.prototype, "starPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], GameManager.prototype, "animRootPrefab", void 0);
    __decorate([
        property
    ], GameManager.prototype, "maxStarDuration", void 0);
    __decorate([
        property
    ], GameManager.prototype, "minStarDuration", void 0);
    __decorate([
        property(cc.Node)
    ], GameManager.prototype, "ground", void 0);
    __decorate([
        property(cc.Node)
    ], GameManager.prototype, "player", void 0);
    __decorate([
        property(cc.Node)
    ], GameManager.prototype, "btnNode", void 0);
    __decorate([
        property(cc.Node)
    ], GameManager.prototype, "gameOverNode", void 0);
    __decorate([
        property(cc.Label)
    ], GameManager.prototype, "scoreDisplay", void 0);
    __decorate([
        property(cc.AudioClip)
    ], GameManager.prototype, "scoreAudio", void 0);
    GameManager = __decorate([
        ccclass
    ], GameManager);
    return GameManager;
}(cc.Component));
exports.default = GameManager;

cc._RF.pop();