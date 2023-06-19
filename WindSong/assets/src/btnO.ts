import { _decorator, Component, Button, error } from 'cc';
import { playKeys } from './autoPlay';
const { ccclass } = _decorator;

@ccclass('btnO')
export class btnO extends Component {
  button: Button = null;
  start() {
    this.button = this.getComponent(Button);
    this.button.node.on(Button.EventType.CLICK, (_) => {
      playKeys().catch((e) => error(e));
    });
  }
}
