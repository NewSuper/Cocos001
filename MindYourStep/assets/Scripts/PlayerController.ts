import {
  _decorator,
  Component,
  Node,
  Vec3,
  systemEvent,
  EventMouse,
  SystemEvent,
  Animation,
  v3,
  tween,
  lerp,
  SkeletalAnimation,
  SkeletalAnimationComponent,
  game,
  error,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(Node)
  public camera: Node | null = null;

  cocosAnim: SkeletalAnimationComponent | null = null;

  bodyAnim: Animation | null = null;

  // 是否接收到跳跃指令
  private _startJump: boolean = false;
  // 当前跳跃时间
  private _curJumpTime: number = 0;
  // 当前跳跃的距离
  private _curIndex: number = 0;
  onLoad() {
    this.bodyAnim = this.node.getComponent(Animation);
    this.cocosAnim = this.getComponentInChildren(SkeletalAnimation);
    if (!this.cocosAnim) {
      error("cocoAnim not found");
    }
  }

  onMouseUp(event: EventMouse) {
    if (event.getButton() === 0) {
      this.jumpByStep(1);
    } else if (event.getButton() === 2) {
      this.jumpByStep(2);
    }
  }

  jumpByStep(step: number) {
    if (this._startJump) {
      return;
    }
    this._startJump = true;
    if (!this.bodyAnim) {
      return;
    }

    let trance: Vec3 = v3();
    if (step === 1) {
      this.bodyAnim.play("oneStep");
      this._curJumpTime = this.bodyAnim.clips[0]?.duration as number;
      trance = v3(1, 0, 0);
    } else if (step === 2) {
      this.bodyAnim.play("twoStep");
      this._curJumpTime = this.bodyAnim.clips[1]?.duration as number;
      trance = v3(2, 0, 0);
    }
    this._curIndex += step;
    tween(this.node)
      .by(this._curJumpTime, { position: trance })
      .call(() => {
        this.onOnceJumpEnd();
      })
      .start();
    if (this.cocosAnim) {
      this.cocosAnim.getState("cocos_anim_jump").speed = 3;
      this.cocosAnim.play("cocos_anim_jump");
    }
  }

  onOnceJumpEnd() {
    this._startJump = false;
    this.node.emit("JumpEnd", this._curIndex);
    if (this.cocosAnim) {
      this.cocosAnim.play("cocos_anim_idle");
    }
  }

  reset() {
    this.node.position = v3(0, 0, 0);
    this._curIndex = 0;
  }

  update(deltaTime: number) {
    if (!this.camera) {
      return;
    }
    let pos = this.camera.position as Vec3;
    pos.x = lerp(pos.x, this.node.position.x, deltaTime * 2);
    this.camera.position = pos;
  }

  setInputActive(active: boolean) {
    
    if (active) {
      systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
    } else {
      systemEvent.off(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
    }
  }
}
