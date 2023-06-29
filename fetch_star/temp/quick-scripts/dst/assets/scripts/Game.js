
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Game.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBOEI7QUFDOUIsaURBQTRDO0FBQzVDLCtCQUEwQjtBQUVwQixJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUc1QztJQUF5QywrQkFBWTtJQUFyRDtRQUFBLHFFQXlLQztRQXZLQyxnQkFBVSxHQUFjLElBQUksQ0FBQztRQUc3QixvQkFBYyxHQUFjLElBQUksQ0FBQztRQUdqQyxxQkFBZSxHQUFHLENBQUMsQ0FBQztRQUdwQixxQkFBZSxHQUFHLENBQUMsQ0FBQztRQUdwQixZQUFNLEdBQVksSUFBSSxDQUFDO1FBR3ZCLFlBQU0sR0FBWSxJQUFJLENBQUM7UUFHdkIsYUFBTyxHQUFZLElBQUksQ0FBQztRQUd4QixrQkFBWSxHQUFZLElBQUksQ0FBQztRQUc3QixrQkFBWSxHQUFhLElBQUksQ0FBQztRQUc5QixnQkFBVSxHQUFpQixJQUFJLENBQUM7UUFFeEIsYUFBTyxHQUFXLENBQUMsQ0FBQztRQUNwQixpQkFBVyxHQUFZLElBQUksQ0FBQztRQUM1QixxQkFBZSxHQUFZLElBQUksQ0FBQztRQUN4QyxXQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLGtCQUFZLEdBQVcsQ0FBQyxDQUFDOztJQXNJM0IsQ0FBQztJQWpJQyw0QkFBTSxHQUFOO1FBQ0UsZUFBZTtRQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRXRELCtCQUErQjtRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUU1QixTQUFTO1FBQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUV0QixrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFckIsaUNBQWlDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCwyQkFBSyxHQUFMLGNBQVMsQ0FBQztJQUVWLGlCQUFpQjtJQUVqQixpQ0FBVyxHQUFYO1FBQ0UsUUFBUTtRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0QsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLDZDQUE2QztRQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEIsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNqQyx1Q0FBdUM7UUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNyRSxhQUFhO1FBQ2IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxrQ0FBWSxHQUFaO1FBQ0UsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ25CLHFCQUFxQjtRQUNyQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLDZDQUE2QztTQUNqRjthQUFNO1lBQ0wsT0FBTyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFDLDZCQUE2QjtZQUM3QixPQUFPLENBQUMsWUFBWSxDQUFDLGNBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN4QztRQUNELGNBQWM7UUFDZCxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFDL0Msd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVCLHVCQUF1QjtRQUN2QixJQUFJLENBQUMsWUFBWTtZQUNmLElBQUksQ0FBQyxlQUFlO2dCQUNwQixJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUVmLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO0lBQzdCLENBQUM7SUFFRCx3Q0FBa0IsR0FBbEI7UUFDRSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxnQ0FBZ0M7UUFDaEMsSUFBSSxLQUFLLEdBQ1AsSUFBSSxDQUFDLE9BQU87WUFDWixJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLFVBQVU7WUFDM0QsRUFBRSxDQUFDO1FBQ0wsdUJBQXVCO1FBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUMvQixLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN6QyxTQUFTO1FBQ1QsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsaUNBQVcsR0FBWCxVQUFZLElBQWE7UUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxtQ0FBYSxHQUFiO1FBQ0UsSUFBSSxFQUFFLENBQUM7UUFDUCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQjthQUFNO1lBQ0wsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxZQUFZLENBQUMsdUJBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELHFDQUFlLEdBQWY7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELDhCQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxtQkFBbUI7UUFDakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRVMsNEJBQU0sR0FBaEIsVUFBaUIsRUFBVTtRQUN6Qix3QkFBd0I7UUFDeEIsYUFBYTtRQUNiLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLHdEQUF3RDtZQUM5RSxPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsK0JBQVMsR0FBVCxVQUFVLEdBQVk7UUFDcEIsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDaEIsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2xELE9BQU87UUFDUCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEUsU0FBUztRQUNULEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQXRLRDtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO21EQUNTO0lBRzdCO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7dURBQ2E7SUFHakM7UUFEQyxRQUFRO3dEQUNXO0lBR3BCO1FBREMsUUFBUTt3REFDVztJQUdwQjtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDOytDQUNLO0lBR3ZCO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7K0NBQ0s7SUFHdkI7UUFEQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztnREFDTTtJQUd4QjtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO3FEQUNXO0lBRzdCO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7cURBQ1c7SUFHOUI7UUFEQyxRQUFRLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQzttREFDUztJQTdCYixXQUFXO1FBRC9CLE9BQU87T0FDYSxXQUFXLENBeUsvQjtJQUFELGtCQUFDO0NBektELEFBeUtDLENBekt3QyxFQUFFLENBQUMsU0FBUyxHQXlLcEQ7a0JBektvQixXQUFXIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcbmltcG9ydCBTY29yZUFuaW1hdG9yIGZyb20gXCIuL1Njb3JlQW5pbWF0b3JcIjtcbmltcG9ydCBTdGFyIGZyb20gXCIuL1N0YXJcIjtcblxuY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcblxuQGNjY2xhc3NcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVNYW5hZ2VyIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAgQHByb3BlcnR5KGNjLlByZWZhYilcbiAgc3RhclByZWZhYjogY2MuUHJlZmFiID0gbnVsbDtcblxuICBAcHJvcGVydHkoY2MuUHJlZmFiKVxuICBhbmltUm9vdFByZWZhYjogY2MuUHJlZmFiID0gbnVsbDtcblxuICBAcHJvcGVydHlcbiAgbWF4U3RhckR1cmF0aW9uID0gMDtcblxuICBAcHJvcGVydHlcbiAgbWluU3RhckR1cmF0aW9uID0gMDtcblxuICBAcHJvcGVydHkoY2MuTm9kZSlcbiAgZ3JvdW5kOiBjYy5Ob2RlID0gbnVsbDtcblxuICBAcHJvcGVydHkoY2MuTm9kZSlcbiAgcGxheWVyOiBjYy5Ob2RlID0gbnVsbDtcblxuICBAcHJvcGVydHkoY2MuTm9kZSlcbiAgYnRuTm9kZTogY2MuTm9kZSA9IG51bGw7XG5cbiAgQHByb3BlcnR5KGNjLk5vZGUpXG4gIGdhbWVPdmVyTm9kZTogY2MuTm9kZSA9IG51bGw7XG5cbiAgQHByb3BlcnR5KGNjLkxhYmVsKVxuICBzY29yZURpc3BsYXk6IGNjLkxhYmVsID0gbnVsbDtcblxuICBAcHJvcGVydHkoY2MuQXVkaW9DbGlwKVxuICBzY29yZUF1ZGlvOiBjYy5BdWRpb0NsaXAgPSBudWxsO1xuXG4gIHByaXZhdGUgZ3JvdW5kWTogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBjdXJyZW50U3RhcjogY2MuTm9kZSA9IG51bGw7XG4gIHByaXZhdGUgY3VycmVudEFuaW1Sb290OiBjYy5Ob2RlID0gbnVsbDtcbiAgdGltZXI6IG51bWJlciA9IDA7XG4gIHN0YXJEdXJhdGlvbjogbnVtYmVyID0gMDtcbiAgc3RhclBvb2w6IGNjLk5vZGVQb29sO1xuICBzY29yZVBvb2w6IGNjLk5vZGVQb29sO1xuICBzY29yZTogbnVtYmVyO1xuXG4gIG9uTG9hZCgpIHtcbiAgICAvLyDojrflj5blnLDlubPpnaLnmoQgeSDovbTlnZDmoIdcbiAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0IC8gMjtcblxuICAgIC8vIHN0b3JlIGxhc3Qgc3RhcidzIHggcG9zaXRpb25cbiAgICB0aGlzLmN1cnJlbnRTdGFyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRBbmltUm9vdCA9IG51bGw7XG5cbiAgICAvLyDliJ3lp4vljJborqHml7blmahcbiAgICB0aGlzLnRpbWVyID0gMDtcbiAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IDA7XG5cbiAgICAvLyBpcyBzaG93aW5nIG1lbnUgb3IgcnVubmluZyBnYW1lXG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG5cbiAgICAvLyBpbml0aWFsaXplIHN0YXIgYW5kIHNjb3JlIHBvb2xcbiAgICB0aGlzLnN0YXJQb29sID0gbmV3IGNjLk5vZGVQb29sKFwiU3RhclwiKTtcbiAgICB0aGlzLnNjb3JlUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIlNjb3JlQW5pbVwiKTtcbiAgfVxuXG4gIHN0YXJ0KCkge31cblxuICAvLyB1cGRhdGUgKGR0KSB7fVxuXG4gIG9uU3RhcnRHYW1lKCkge1xuICAgIC8vIOWIneWni+WMluiuoeWIhlxuICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIHRoaXMuc2NvcmVEaXNwbGF5LnN0cmluZyA9IFwiU2NvcmU6IFwiICsgdGhpcy5zY29yZS50b1N0cmluZygpO1xuICAgIC8vIHNldCBnYW1lIHN0YXRlIHRvIHJ1bm5pbmdcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgIC8vIHNldCBidXR0b24gYW5kIGdhbWVvdmVyIHRleHQgb3V0IG9mIHNjcmVlblxuICAgIHRoaXMuYnRuTm9kZS54ID0gMzAwMDtcbiAgICAvLyBcIkdhbWUgT3ZlclwiIG5vdCB2aXNpYmxlXG4gICAgdGhpcy5nYW1lT3Zlck5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgLy8gcmVzZXQgcGxheWVyIHBvc2l0aW9uIGFuZCBtb3ZlIHNwZWVkXG4gICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFBsYXllcikuc3RhcnRNb3ZlQXQoY2MudjIoMCwgdGhpcy5ncm91bmRZKSk7XG4gICAgLy8gc3Bhd24gc3RhclxuICAgIHRoaXMuc3Bhd25OZXdTdGFyKCk7XG4gIH1cblxuICBzcGF3bk5ld1N0YXIoKSB7XG4gICAgbGV0IG5ld1N0YXIgPSBudWxsO1xuICAgIC8vIOS9v+eUqOe7meWumueahOaooeadv+WcqOWcuuaZr+S4reeUn+aIkOS4gOS4quaWsOiKgueCuVxuICAgIGlmICh0aGlzLnN0YXJQb29sLnNpemUoKSA+IDApIHtcbiAgICAgIG5ld1N0YXIgPSB0aGlzLnN0YXJQb29sLmdldCh0aGlzKTsgLy8gdGhpcyB3aWxsIGJlIHBhc3NlZCB0byBTdGFyJ3MgcmV1c2UgbWV0aG9kXG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1N0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0YXJQcmVmYWIpO1xuICAgICAgLy8gcGFzcyBHYW1lIGluc3RhbmNlIHRvIHN0YXJcbiAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KFN0YXIpLnJldXNlKHRoaXMpO1xuICAgIH1cbiAgICAvLyDkuLrmmJ/mmJ/orr7nva7kuIDkuKrpmo/mnLrkvY3nva5cbiAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3U3RhclBvc2l0aW9uKCkpO1xuICAgIC8vIOWwhuaWsOWinueahOiKgueCuea3u+WKoOWIsCBDYW52YXMg6IqC54K55LiL6Z2iXG4gICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuXG4gICAgLy8g6YeN572u6K6h5pe25Zmo77yM5qC55o2u5raI5aSx5pe26Ze06IyD5Zu06ZqP5py65Y+W5LiA5Liq5YC8XG4gICAgdGhpcy5zdGFyRHVyYXRpb24gPVxuICAgICAgdGhpcy5taW5TdGFyRHVyYXRpb24gK1xuICAgICAgTWF0aC5yYW5kb20oKSAqICh0aGlzLm1heFN0YXJEdXJhdGlvbiAtIHRoaXMubWluU3RhckR1cmF0aW9uKTtcbiAgICB0aGlzLnRpbWVyID0gMDtcblxuICAgIHRoaXMuY3VycmVudFN0YXIgPSBuZXdTdGFyO1xuICB9XG5cbiAgZ2V0TmV3U3RhclBvc2l0aW9uKCkge1xuICAgIGxldCByYW5kWCA9IDA7XG4gICAgLy8g5qC55o2u5Zyw5bmz6Z2i5L2N572u5ZKM5Li76KeS6Lez6LeD6auY5bqm77yM6ZqP5py65b6X5Yiw5LiA5Liq5pif5pif55qEIHkg5Z2Q5qCHXG4gICAgbGV0IHJhbmRZID1cbiAgICAgIHRoaXMuZ3JvdW5kWSArXG4gICAgICBNYXRoLnJhbmRvbSgpICogdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFBsYXllcikuanVtcEhlaWdodCArXG4gICAgICA1MDtcbiAgICAvLyDmoLnmja7lsY/luZXlrr3luqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ8geCDlnZDmoIdcbiAgICBsZXQgbWF4WCA9IHRoaXMubm9kZS53aWR0aCAvIDI7XG4gICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcbiAgICAvLyDov5Tlm57mmJ/mmJ/lnZDmoIdcbiAgICByZXR1cm4gY2MudjIocmFuZFgsIHJhbmRZKTtcbiAgfVxuXG4gIGRlc3Bhd25TdGFyKHN0YXI6IGNjLk5vZGUpIHtcbiAgICB0aGlzLnN0YXJQb29sLnB1dChzdGFyKTtcbiAgICB0aGlzLnNwYXduTmV3U3RhcigpO1xuICB9XG5cbiAgc3Bhd25BbmltUm9vdCgpIHtcbiAgICBsZXQgZng7XG4gICAgaWYgKHRoaXMuc2NvcmVQb29sLnNpemUoKSA+IDApIHtcbiAgICAgIGZ4ID0gdGhpcy5zY29yZVBvb2wuZ2V0KHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmeCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYW5pbVJvb3RQcmVmYWIpO1xuICAgICAgZnguZ2V0Q29tcG9uZW50KFNjb3JlQW5pbWF0b3IpLnJldXNlKHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gZng7XG4gIH1cblxuICBkZXNwYXduQW5pbVJvb3QoKSB7XG4gICAgdGhpcy5zY29yZVBvb2wucHV0KHRoaXMuY3VycmVudEFuaW1Sb290KTtcbiAgfVxuXG4gIGdhbWVPdmVyKCkge1xuICAgIHRoaXMuZ2FtZU92ZXJOb2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5idG5Ob2RlLnggPSAwO1xuICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudChQbGF5ZXIpLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXllci5zdG9wQWxsQWN0aW9ucygpOyAvL+WBnOatoiBwbGF5ZXIg6IqC54K555qE6Lez6LeD5Yqo5L2cXG4gICAgdGhpcy5jdXJyZW50U3Rhci5kZXN0cm95KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyDmr4/luKfmm7TmlrDorqHml7blmajvvIzotoXov4fpmZDluqbov5jmsqHmnInnlJ/miJDmlrDnmoTmmJ/mmJ9cbiAgICAvLyDlsLHkvJrosIPnlKjmuLjmiI/lpLHotKXpgLvovpFcbiAgICBpZiAodGhpcy50aW1lciA+IHRoaXMuc3RhckR1cmF0aW9uKSB7XG4gICAgICB0aGlzLmdhbWVPdmVyKCk7XG4gICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTsgLy8gZGlzYWJsZSBnYW1lT3ZlciBsb2dpYyB0byBhdm9pZCBsb2FkIHNjZW5lIHJlcGVhdGVkbHlcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy50aW1lciArPSBkdDtcbiAgfVxuXG4gIGdhaW5TY29yZShwb3M6IGNjLlZlYzMpIHtcbiAgICB0aGlzLnNjb3JlICs9IDE7XG4gICAgLy8g5pu05pawIHNjb3JlRGlzcGxheSBMYWJlbCDnmoTmloflrZdcbiAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSBcIlNjb3JlOiBcIiArIHRoaXMuc2NvcmU7XG4gICAgLy8g5pKt5pS+54m55pWIXG4gICAgdGhpcy5jdXJyZW50QW5pbVJvb3QgPSB0aGlzLnNwYXduQW5pbVJvb3QoKTtcbiAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5jdXJyZW50QW5pbVJvb3QpO1xuICAgIHRoaXMuY3VycmVudEFuaW1Sb290LnBvc2l0aW9uID0gcG9zO1xuICAgIHRoaXMuY3VycmVudEFuaW1Sb290LmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkoXCJzY29yZV9wb3BcIik7XG4gICAgLy8g5pKt5pS+5b6X5YiG6Z+z5pWIXG4gICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLnNjb3JlQXVkaW8sIGZhbHNlKTtcbiAgfVxufVxuIl19