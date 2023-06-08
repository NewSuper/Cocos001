const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    leftFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    rightFrame: cc.SpriteFrame = null;

    onLoad() {
        this.node.on('apart', this.apart, this);
    }

    start() {
    }

    update (dt) {
        this.drop();
    }

    apart() {
        this.node.group = 'default';
        //删除一个组件
        let polyon = this.node.removeComponent(cc.PhysicsPolygonCollider);

        //复制节点
        let left = this.node;
        let right = cc.instantiate(this.node);
        this.node.parent.addChild(right);

        //左边半边的节点
        let leftSprite = left.getComponent(cc.Sprite);
        leftSprite.spriteFrame = this.leftFrame
        this.addForce(left, -1)

        //右边半边的节点
        let rightSprite = right.getComponent(cc.Sprite);
        rightSprite.spriteFrame = this.rightFrame;
        this.addForce(right, 1);
    }

    //添加一个力
    addForce(furit: cc.Node, dirction: number) {
        let rigid = furit.getComponent(cc.RigidBody);
        let force = cc.v2(dirction, -0.1);
        rigid.linearVelocity = force.mul(200);
        rigid.angularVelocity = Math.random() * 120+60;
        rigid.gravityScale=6;
    }

    //水果掉落
    drop(){
        if(this.node.y<=-cc.winSize.height){
            if(this.node.group=='fruit'){
                //获取画布的实例对象
                let canvas=cc.Canvas.instance;
                canvas.node.emit('onDrop');
            }
            this.node.destroy();
        }
    }
}
