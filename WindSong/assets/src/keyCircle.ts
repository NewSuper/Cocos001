import {
  _decorator,
  Component,
  AnimationComponent,
  instantiate,
  find,
} from 'cc';
const { ccclass } = _decorator;

@ccclass('keyCircle')
export class KeyCircle extends Component {
  start() {
    this.getComponent(AnimationComponent).on(
      AnimationComponent.EventType.FINISHED,
      () => this.destroy(),
      this
    );
  }
}

export function genCircle(pos) {
  const node = instantiate(find('keyCircle'));
  node.parent = find('Widget/Canvas/WidgetKeys/keys');
  node.setWorldPosition(pos);
  node.setSiblingIndex(0);
  node.getComponent(AnimationComponent).play('circleFadeOut');
}
