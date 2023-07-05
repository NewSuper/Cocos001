const { ccclass, property } = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    @property([cc.SpriteFrame])
    spriteFrameList: cc.SpriteFrame[] = []

    @property(cc.Vec2)
    mid: cc.Vec2 = cc.v2();

    isNew:boolean=true;
    // onLoad () {}

    start() {
        let sprite = this.node.getComponent(cc.Sprite);
        let index = (Math.random() * this.spriteFrameList.length) | 0;
        sprite.spriteFrame=this.spriteFrameList[index];
    }

    jumpTarget(wPos:cc.Vec3){
        if(!this.isNew){
            return 0;
        }

        this.isNew=false;
        //mid转换位当前节点的坐标
        let end=cc.v3(this.node.convertToNodeSpaceAR(this.mid));
        //判断跳跃的距离和当前中心点的距离
        let distance=end.sub(wPos);
        //距离的长度
        let len=distance.len();
        if(len<30){
            return 2;
        }
        return 1;
    }

    // update (dt) {}
}
