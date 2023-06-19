import { _decorator, Component, RichText, AnimationComponent } from 'cc';
const { ccclass } = _decorator;

let tipComponent;

@ccclass('Tip')
export class Tip extends Component {
  richText: RichText = null!;
  animationComponent: AnimationComponent = null!;
  start() {
    this.richText = this.getComponent(RichText);
    this.animationComponent = this.getComponent(AnimationComponent);
    tipComponent = this;
  }
}

export function showTip(tip) {
  tipComponent.animationComponent.play('fadeInAndOut');
  tipComponent.richText.string = tip;
}
