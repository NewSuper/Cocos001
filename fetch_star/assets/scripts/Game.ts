import Player from "./Player";
import ScoreAnimator from "./ScoreAnimator";
import Star from "./Star";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Prefab)
  starPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  animRootPrefab: cc.Prefab = null;

  @property
  maxStarDuration = 0;

  @property
  minStarDuration = 0;

  @property(cc.Node)
  ground: cc.Node = null;

  @property(cc.Node)
  player: cc.Node = null;

  @property(cc.Node)
  btnNode: cc.Node = null;

  @property(cc.Node)
  gameOverNode: cc.Node = null;

  @property(cc.Label)
  scoreDisplay: cc.Label = null;

  @property(cc.AudioClip)
  scoreAudio: cc.AudioClip = null;

  private groundY: number = 0;
  private currentStar: cc.Node = null;
  private currentAnimRoot: cc.Node = null;
  timer: number = 0;
  starDuration: number = 0;
  starPool: cc.NodePool;
  scorePool: cc.NodePool;
  score: number;

  onLoad() {
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
  }

  start() {}

  // update (dt) {}

  onStartGame() {
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
    this.player.getComponent(Player).startMoveAt(cc.v2(0, this.groundY));
    // spawn star
    this.spawnNewStar();
  }

  spawnNewStar() {
    let newStar = null;
    // 使用给定的模板在场景中生成一个新节点
    if (this.starPool.size() > 0) {
      newStar = this.starPool.get(this); // this will be passed to Star's reuse method
    } else {
      newStar = cc.instantiate(this.starPrefab);
      // pass Game instance to star
      newStar.getComponent(Star).reuse(this);
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
  }

  getNewStarPosition() {
    let randX = 0;
    // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
    let randY =
      this.groundY +
      Math.random() * this.player.getComponent(Player).jumpHeight +
      50;
    // 根据屏幕宽度，随机得到一个星星 x 坐标
    let maxX = this.node.width / 2;
    randX = (Math.random() - 0.5) * 2 * maxX;
    // 返回星星坐标
    return cc.v2(randX, randY);
  }

  despawnStar(star: cc.Node) {
    this.starPool.put(star);
    this.spawnNewStar();
  }

  spawnAnimRoot() {
    let fx;
    if (this.scorePool.size() > 0) {
      fx = this.scorePool.get(this);
    } else {
      fx = cc.instantiate(this.animRootPrefab);
      fx.getComponent(ScoreAnimator).reuse(this);
    }
    return fx;
  }

  despawnAnimRoot() {
    this.scorePool.put(this.currentAnimRoot);
  }

  gameOver() {
    this.gameOverNode.active = true;
    this.btnNode.x = 0;
    this.player.getComponent(Player).enabled = false;
    this.player.stopAllActions(); //停止 player 节点的跳跃动作
    this.currentStar.destroy();
  }

  protected update(dt: number): void {
    // 每帧更新计时器，超过限度还没有生成新的星星
    // 就会调用游戏失败逻辑
    if (this.timer > this.starDuration) {
      this.gameOver();
      this.enabled = false; // disable gameOver logic to avoid load scene repeatedly
      return;
    }
    this.timer += dt;
  }

  gainScore(pos: cc.Vec3) {
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
  }
}
