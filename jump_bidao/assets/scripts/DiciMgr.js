cc.Class({
    extends: cc.Component,

    properties: {
        diciPrefab : {type:cc.Prefab, default:null, tooltip:"壁刀预制体"},
        minInterval : {type:cc.Float, default:1.5, tooltip:"生成壁刀的最短时间间隔"},
        maxInterval : {type:cc.Float, default:2.5, tooltip:"生成壁刀的最大时间间隔"},
    },

    // onLoad () {},

    start () {
        this.isGameOver = false;
        this.intervalLen = this.maxInterval - this.minInterval;
        this.intervalTime = Math.random()*this.intervalLen + this.minInterval;
        this.passedTime = this.intervalTime;
    },

    update (dt) {
        if(this.isGameOver === true){
            return;
        }
        this.passedTime += dt;
        if(this.passedTime >= this.intervalTime){
            this.genDici();
            this.passedTime = 0;
            this.intervalTime = Math.random()*this.intervalLen + this.minInterval;
        }
    },

    genDici(){
        let diciNode = cc.instantiate(this.diciPrefab);
        this.node.addChild(diciNode);
    },
});
