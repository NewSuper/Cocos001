import { _decorator, Component, Button } from 'cc';
import { setDelay } from './autoPlay';
const { ccclass } = _decorator;

@ccclass('btnP')
export class btnP extends Component {
  button: Button = null;
  start() {
    this.button = this.getComponent(Button);
    this.button.node.on(Button.EventType.CLICK, (_) => {
      setDelay();
    });
  }
}
