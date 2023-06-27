cc.Class({
    extends: cc.Component,

    properties: {
        map : {type:require("map_gen"),default:null, tooltip:"路径组件"},
    },

    pauseNav(){
        this.isWalking = false;
    },

    goAhead(){
        this.isWalking = true;
    },

    initConfig(config){
        this.config = config;
        this.speed = this.config.speed;
        this.roadIndex = this.config.roadIndex;
    },


    // onLoad () {},

    start () {
        this.passedTime = 0;
        this.isWalking = false;
        // 初始化敌人的相关数据，通常会读取数据库或配置文件数据
        this.initConfig({speed:200, max_blood:600, killValue:150, roadIndex:0});

        // 得到路径点的所有数据
        this.genAtPath(this.roadIndex);
        
        // 让当前玩家沿着roadData里面的所有数据点一步一步运动
        this.walk();

        this.scheduleOnce(this.pauseNav.bind(this), 3);
        this.scheduleOnce(this.goAhead.bind(this), 5);
    },

    walk(){
        if(this.roadData.length < 2){
            return;
        }

        this.node.setPosition(this.roadData[0].x, this.roadData[0].y);
        this.nextStep = 1;
        this.walk2next();       // 从当前点走到下一步
    },

    walk2next(){
        if(this.nextStep >= this.roadData.length){
            this.isWalking = false;
            return;
        }

        let src = this.node.getPosition();      // 玩家当前所在位置
        let dst = this.roadData[this.nextStep];
        let dir = dst.sub(src);
        let len = dir.mag();
        if(len <= 0){
            this.nextStep ++;
            this.walk2next();
            return;
        }
        this.walkTime = len / this.speed;
        this.vx = this.speed * dir.x / len;
        this.vy = this.speed * dir.y / len;
        this.passedTime = 0;        // 每一步的计时器
        this.isWalking = true;
    },

    genAtPath(roadIndex){
        let roadSet = this.map.get_road_set();      // 所有路线的集合
        if(roadIndex < 0 || roadIndex >= roadSet.length){
            return;
        }
        // 当前这条线路的点的集合
        this.roadData = roadSet[roadIndex];
        console.log("roadData:", this.roadData);
    },

    // dt每次更新的时间间隔 |---dt----|-------dt-------|
    update (dt) {
        console.log(dt);
        if(this.isWalking === false){
            return;
        }

        this.passedTime += dt;
        if(this.passedTime >= this.walkTime){
            dt -= (this.passedTime - this.walkTime);
        }
        this.node.x += this.vx * dt;
        this.node.y += this.vy * dt;

        if(this.passedTime >= this.walkTime){
            this.nextStep++;
            this.walk2next();
        }
    },
});
