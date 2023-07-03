import {
  _decorator,
  Component,
  Prefab,
  instantiate,
  Node,
  Label,
  game,
  v3,
  log,
} from "cc";

import { PlayerController } from "./PlayerController";
const { ccclass, property } = _decorator;

// 赛道格子类型，坑（BT_NONE）或者实路（BT_STONE）
enum BlockType {
  BT_NONE,
  BT_STONE,
}

enum GameState {
  GS_INIT,
  GS_PLAYING,
  GS_END,
}

@ccclass("GameManager")
export class GameManager extends Component {
  // 赛道预制
  @property({ type: Prefab })
  public cubePrefab: Prefab | null = null;
  // 赛道长度
  @property
  public roadLength = 50;

  @property(Node)
  public startMenu: Node | null = null;

  @property({ type: Label })
  public stepsLabel: Label | null = null;

  @property({ type: PlayerController })
  public playerCtrl: PlayerController | null = null;

  private _road: BlockType[] = [];

  private _curMoveIndex = 0;



  start() {
    this.curState = GameState.GS_INIT;
    this.playerCtrl?.node.on("JumpEnd", this.onPlayerJumpEnd, this);
    this.init();
  }

  init() {
    if (this.startMenu) {
      this.startMenu.active = true;
    }
    this.generateRoad();
    if (this.playerCtrl) {
      this.playerCtrl.setInputActive(false);
      this.playerCtrl.reset();
    }
  }

  generateRoad() {
    // 防止游戏重新开始时，赛道还是旧的赛道
    // 因此，需要移除旧赛道，清除旧赛道数据
    this.node.removeAllChildren();
    this._road = [];
    // 确保游戏运行时，人物一定站在实路上
    this._road.push(BlockType.BT_STONE);

    // 确定好每一格赛道类型
    for (let i = 1; i < this.roadLength; i++) {
      // 如果上一格赛道是坑，那么这一格一定不能为坑
      if (this._road[i - 1] === BlockType.BT_NONE) {
        this._road.push(BlockType.BT_STONE);
      } else {
        this._road.push(Math.floor(Math.random() * 2));
      }
    }
    // 根据赛道类型生成赛道
    for (let j = 0; j < this._road.length; j++) {
      let block = this.spawnBlockByType(this._road[j]);
      // 判断是否生成了道路，因为 spawnBlockByType 有可能返回坑（值为 null）
      if (block) {
        this.node.addChild(block);
        block.position=v3(j, 0, 0);
      }
    }
  }

  spawnBlockByType(type: BlockType) {
    if (!this.cubePrefab) {
      return null;
    }
    let block: Node | null = null;
    // 赛道类型为实路才生成
    switch (type) {
      case BlockType.BT_STONE:
        block = instantiate(this.cubePrefab);
        break;
    }
    return block;
  }

  set curState(value: GameState) {
    switch (value) {
      case GameState.GS_INIT:
        this.init();
        break;
      case GameState.GS_PLAYING:
        if (this.startMenu) {
          this.startMenu.active = false;
        }
        if (this.stepsLabel) {
          this.stepsLabel.string = "0"; // 将步数重置为0
        }
        this.scheduleOnce(() => {
          // 直接设置 active 会直接开始监听鼠标事件，这里做了延迟处理
          if (this.playerCtrl) {
            this.playerCtrl.setInputActive(true);
          }
        }, 0.1);
        break;
      case GameState.GS_END:
        
        break;
    }
  }

  checkResult(moveIndex: number) {
    if (moveIndex < this.roadLength) {
      // 跳到了坑上
      if (this._road[moveIndex] == BlockType.BT_NONE) {
        this.curState = GameState.GS_INIT;
        log(moveIndex+' '+moveIndex);
        
      }
    } else {
      // 跳过了最大长度
      this.curState = GameState.GS_INIT;
    }
  }

  onPlayerJumpEnd(moveIndex: number) {
    if (this.stepsLabel) {
      this.stepsLabel.string = "" + moveIndex;
      this.checkResult(moveIndex);
    }
  }

  onStartButtonClicked() {
    this.curState = GameState.GS_PLAYING;
  }
}
