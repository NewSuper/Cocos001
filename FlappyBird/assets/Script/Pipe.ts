import { _decorator, Component, Intersection2D, Node, Rect, Sprite, UITransform } from 'cc';
import { BirdCtrl } from './BirdCtrl';
const { ccclass, property } = _decorator;

@ccclass('Pipe')
export class Pipe extends Component {

    @property({
        type: Sprite,
        displayName: "上方管道-upPipe"
    })
    private upPipe: Sprite = null!;

    @property({
        type: Sprite,
        displayName: "下方管道-downPipe"
    })
    private downPipe: Sprite = null!;


    /**
     * 鸟是否碰撞到管道
     * @param birdCtrl 鸟
     */
    CheckBirdCollision(birdCtrl: BirdCtrl): boolean {
        const birdPositionInPipe = this.node.getComponent(UITransform).convertToNodeSpaceAR(birdCtrl.node.worldPosition);
        const birdRect = new Rect(birdPositionInPipe.x - 34, birdPositionInPipe.y - 24, 68, 48)
        // 如果上边碰撞了
        if (Intersection2D.rectRect(birdRect, new Rect(-26, 100, 52, 1024))) {
            return true;
        }

        // 如果下边碰撞了
        if (Intersection2D.rectRect(birdRect, new Rect(-26, -100 - 1024, 52, 1024))) {
            return true;
        }

        return false;
    }
}

