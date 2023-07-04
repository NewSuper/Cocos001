cc.Class({
    extends: cc.Component,

    properties: {
        upSpeed : {type:cc.Float, default:100, tooltip:"壁刀向上运动的速度"},
    },

    onLoad () {
        // 控制壁刀所在侧
        this.sideType = Math.random() > 0.5 ? 1 : -1;
        this.node.x = this.sideType * this.node.x;
        this.node.scaleX = this.sideType * this.node.scaleX;
    },

    start () {

    },

    update (dt) {
        this.node.y += this.upSpeed * dt;
        if(this.node.y >= cc.winSize.height/2 + this.node.height/2){
            this.node.removeFromParent();     
            console.log("remove!");
        }
    },
});
