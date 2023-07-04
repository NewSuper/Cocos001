cc.Class({
    extends: cc.Component,

    properties: {
        upSpeed : {type:cc.Float, default:800, tooltip:"壁刀向上运动的速度"},
        minInterval : {type:cc.Float, default:2.5, tooltip:"生成壁刀的最短时间间隔"},
        maxInterval : {type:cc.Float, default:4.5, tooltip:"生成壁刀的最大时间间隔"},
    },

    onLoad () {
        this.originY = this.node.y;     // 最开始的y坐标
        this.intervalLen = this.maxInterval - this.minInterval;
        this.intervalTime = Math.random()*this.intervalLen + this.minInterval;
        this.passedTime = this.intervalTime;
    },

    start () {

    },

    update (dt) {
        this.node.y += this.upSpeed * dt;
        if(this.node.y >= cc.winSize.height/2 + this.node.height/2){
            this.passedTime += dt;
            if(this.passedTime >= this.intervalTime){
                this.node.y = this.originY;
                this.passedTime = 0;
                this.intervalTime  = Math.random()*this.intervalLen + this.minInterval;
            }
        }
    },
});
