const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  @property
  jumpHeight: number = 0;

  @property
  jumpDuration: number = 0;

  @property
  squashDuration: number = 0;

  @property
  maxMoveSpeed: number = 0;

  @property
  accel: number = 0;

  @property(cc.AudioClip)
  jumpAudio: cc.AudioClip = null;

  jumpAction: cc.ActionInstant;
  accLeft: boolean;
  accRight: boolean;
  xSpeed: number;

  onLoad() {
    this.enabled = false;

    // 初始化跳跃动作
    this.jumpAction = this.setJumpAction();

    // 加速度方向开关
    this.accLeft = false;
    this.accRight = false;
    // 主角当前水平方向速度
    this.xSpeed = 0;

    // 初始化键盘输入监听
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    var touchReceiver = cc.Canvas.instance.node;
    touchReceiver.on("touchstart", this.onTouchStart, this);
    touchReceiver.on("touchend", this.onTouchEnd, this);
  }

  start() {}

  startMoveAt(pos: cc.Vec2) {
    this.enabled = true;
    this.xSpeed = 0;
    this.node.setPosition(pos);
    this.node.runAction(this.setJumpAction());
  }

  update(dt) {
    // 根据当前加速度方向每帧更新速度
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt;
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt;
    }
    // 限制主角的速度不能超过最大值
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      // if speed reach limit, use max speed with current direction
      this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed);
    }
    if (!this.accLeft && !this.accRight) {
      //速度不断衰减
      this.xSpeed = this.xSpeed * 0.99;
    }

    // 根据当前速度更新主角的位置
    this.node.x += this.xSpeed * dt;

    // limit player position inside screen
    if (this.node.x > this.node.parent.width / 2) {
      this.node.x = this.node.parent.width / 2;
      //反向
      this.xSpeed = -this.xSpeed;
    } else if (this.node.x < -this.node.parent.width / 2) {
      this.node.x = -this.node.parent.width / 2;
      this.xSpeed = -this.xSpeed;
    }
  }

  setJumpAction() {
    // 跳跃上升
    let jumpUp = cc
      .moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight))
      .easing(cc.easeCubicActionOut());
    // 下落
    let jumpDown = cc
      .moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight))
      .easing(cc.easeCubicActionIn());
    // 形变
    let squash = cc.scaleTo(this.squashDuration, 1, 0.6);
    let stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
    let scaleBack = cc.scaleTo(this.squashDuration, 1, 1);
    // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
    let callback = cc.callFunc(this.playJumpSound, this);
    // 不断重复，而且每次完成落地动作后调用回调来播放声音
    return cc.repeatForever(
      cc.sequence(squash, stretch, jumpUp, scaleBack, jumpDown, callback)
    );
  }

  playJumpSound() {
    // 调用声音引擎播放声音
    cc.audioEngine.playEffect(this.jumpAudio, false);
  }

  onKeyDown(event: cc.Event.EventKeyboard) {
    // set a flag when key pressed
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = true;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = true;
        break;
    }
  }

  onKeyUp(event: cc.Event.EventKeyboard) {
    // unset a flag when key released
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = false;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = false;
        break;
    }
  }

  onDestroy() {
    // 取消键盘输入监听
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    var touchReceiver = cc.Canvas.instance.node;
    touchReceiver.off("touchstart", this.onTouchStart, this);
    touchReceiver.off("touchend", this.onTouchEnd, this);
  }

  onTouchStart(event) {
    var touchLoc = event.getLocation();
    if (touchLoc.x >= cc.winSize.width / 2) {
      this.accLeft = false;
      this.accRight = true;
    } else {
      this.accLeft = true;
      this.accRight = false;
    }
  }

  onTouchEnd(event) {
    this.accLeft = false;
    this.accRight = false;
  }
}
