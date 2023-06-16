
const {ccclass, property} = cc._decorator;

@ccclass
export default class FollowTarget extends cc.Component {

    @property(cc.Node)
    private target: cc.Node = null;

    private offsetX: number = 0;

    start(): void {
        if(this.target !== null) {
            this.offsetX = this.node.x - this.target.x;
        }
    }

    lateUpdate(): void {
        if(this.target !== null) {
            this.node.x = this.target.x + this.offsetX;
        }
    }
}
