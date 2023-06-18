
const {ccclass, property} = cc._decorator;

@ccclass
export default class enable_collider extends cc.Component {
    @property
    is_enbale: boolean = true;

    @property
    is_debug: boolean = true;

    public onLoad () : void {
        if (this.is_enbale) {
            var manager : any = cc.director.getCollisionManager();
            manager.enabled = true; // 开启碰撞
            if (this.is_debug) {
                manager.enabledDebugDraw = true; // 调试状态绘制出我们物体的碰撞器的形状
            }
        }
    }
}
