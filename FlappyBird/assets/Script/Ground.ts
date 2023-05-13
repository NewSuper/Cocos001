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
/** 1.canvas 层级下--2D对象--sprite精灵--background   
 *     设置全局尺寸content size 775 1334  
 *     导入背景图sprite frame
 *     anchor point  (0.5,0.5)   
 *     size mode     custom   
 *     type          simple
 * 
 * 所有都在canvas 层级下，去掉所有trim 
 * 2.创建 ground空节点 ，
 *    content size    (0,0)   
 *    position       （0，-480，0） 
 *    anchor point    (0.5,0.5)
 *    写个Ground.ts 写逻辑
 *    添加widget组件 bottom 设置为112
 *   2.1在ground节点下，再创建base空节点,导入base图片
 *     position      (-375,0,0)
 *     content size   1600 112
 *     size mode      custom   
 *     type           tiled 
 *  3.新建bird空节点    content size(0,0)   scale (2,2,2)
 *  
 *  4.新建 pipeMgr  content size(0,0) 
 *    在pipeMgr 节点下，新建pipe  content size(0,1334) 
 *    在pipe 下 导入管道图片 pipe-green-up,pipe-green-down
 *    
 *   pipe-green-up     position (0,100,0)  anchor point(0.5,0)
 *   pipe-green-down   position (0,-100,0)  anchor point(0.5,1)
 * 
 *  5.第4步做完，就把pipe 变成预制体，并赋值
 * 
 *  6.新建StartScreen空节点  content size(750,1334) 
 *    再添加sprite 组件 ，更换sprite frame default_sprite_splash
 *    size mode--custom ,type--sliced
 *    再添加button，click events 为1,赋值
 *  7.新建gameCtrl 空节点，用来控制整个游戏的逻辑
 *    移到最上层，canvas 下面第1个，并创建gamectrl 脚本 ，新增clickStart函数
 *    回到startScreen 的click Events 
 *    gameCtrl   -- gameCtrl -- clickStart
 *  8.挂载 startScreen 脚本，运行即可
 * 
 *  9.新建LoseUI 空节点750，1334，   再新建lose-label写上游戏线束
 *    添加sprite 组件渲染，default_sprite_splash   custom slice  color  0,0,0,200
 * 
 *    复制1份LoseUI命名SpriteSplash ,去掉lose-label。再去掉上层LoseUI 的sprite 组件
 *     再添加widget组件.把上下左右锁定
 *    
 *   再 复制一次lose-label  命名record-label
 *   
 *   为防止用户点击触摸到下一层，LoseUI 添加一个BlockInputEvents,然后loseUI 默认不显示*/