const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    brickPrefab: cc.Prefab = null;

    @property
    brickNum: number = 0;

    start() {
        this.node.removeAllChildren();
        for (let i = 0; i < this.brickNum; i++) {
            let brickNode = cc.instantiate(this.brickPrefab);
            this.node.addChild(brickNode);

        }
        //延迟一秒执行
        this.scheduleOnce(() => { 
            //表格布局完成之后关闭自动布局
            let layout = this.node.getComponent(cc.Layout);
            layout.type = cc.Layout.Type.NONE;
        }, 1)
    }
    // update (dt) {}
}
