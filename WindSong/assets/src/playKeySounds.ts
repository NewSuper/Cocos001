import {
  Component,
  Input,
  AudioSource,
  EventTouch,
  EventKeyboard,
  AnimationComponent,
  input,
} from 'cc';
import { keyMap, playing } from './autoPlay';
import { genCircle } from './keyCircle';
import { showTip } from './Tip';

export class Key extends Component {
  key = null;

  audioSource: AudioSource = null!;
  animation: AnimationComponent = null!;

  start() {
    this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    this.audioSource = this.node.getComponent(AudioSource)!;
    this.animation = this.node.getComponent(AnimationComponent)!;

    keyMap.set(this.key, this);
  }

  onTouchStart(_: EventTouch) {
    if (!playing) {
      this.down();
    } else {
      showTip('<color=#ff0000>正在自动弹奏，无法点击</color>');
    }
  }

  onKeyDown(event: EventKeyboard) {
    if (event.keyCode === this.key) {
      if (!playing) {
        this.down();
      } else {
        showTip('<color=#ff0000>正在自动弹奏，无法点击</color>');
      }
    }
  }

  onTouchEnd(_: EventTouch) {
    if (!playing) {
      this.up();
    }
  }

  onKeyUp(event: EventKeyboard) {
    if (event.keyCode === this.key) {
      if (!playing) {
        this.up();
      }
    }
  }

  down() {
    this.audioSource.playOneShot(this.audioSource.clip, 1);
    this.animation.crossFade('keydown');
    genCircle(this.node.worldPosition)
  }

  up() {
    this.animation.crossFade('keyup');
  }
}
