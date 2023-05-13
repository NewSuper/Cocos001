import { _decorator, Component, Vec3 } from 'cc';
import { BirdCtrl } from './BirdCtrl';
import { GameConst } from './GameConst';
const { ccclass, property } = _decorator;

@ccclass('Ground')
export class Ground extends Component {
    /** 移动开关 false: 关 true: 开 */
    private m_MoveSwitch = false;
    SetEnableMove(isMoveable: boolean) {
        this.m_MoveSwitch = isMoveable;
    }

    OnUpdate(deltaTime: number) {
        if(!this.m_MoveSwitch) {
            return;
        }
        
        let newX = this.node.position.x - GameConst.MOVE_SPEED;
        if(newX < -750) {
            newX = newX + 750
        }
        this.node.position = new Vec3(newX, this.node.position.y, this.node.position.z);
    }

    /**
     * 鸟是否掉在地面上
     * @param birdCtrl 鸟
     */
    CheckBirdCollision(birdCtrl: BirdCtrl): boolean {
        if(birdCtrl.GetFootY() < this.node.position.y) {
            birdCtrl.SetBirdToGroundY(this.node.position.y);
            return true;
        }

        return false;
    }
}
