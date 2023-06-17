cc.Class({
    extends: cc.Component,

    properties: {
        maskBg : {type:cc.Node, default:null, tooltip:"遮罩涂层"},
        scratchRadiuX:{type:cc.Float, default:20.0, tooltip:"每一次刮开区域的宽度的半径"},
        scratchRadiuY:{type:cc.Float, default:10.0, tooltip:"每一次刮开区域的高度的半径"},

        resultDialog : {type:cc.Node, default:null,tooltip:"弹出式对话框"},
    },

    onLoad () {
        this.mask = this.node.getChildByName("Mask").getComponent(cc.Mask);

        // 初始化涂层数据，在每一个格子处记录一个点坐标
        this.initMaskPoints();

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    // 将遮罩层切分为小块地砖区域，每个地砖区域记录地砖的中心点坐标
    initMaskPoints(){
        let rows = Math.floor(this.maskBg.height/(this.scratchRadiuY*2));
        let cols = Math.floor(this.maskBg.width/(this.scratchRadiuX*2));
        rows = Math.ceil(rows/2);
        cols = Math.ceil(cols/2);

        this.hidePoints = [];
        for(let i=-rows; i<=rows; i++){
            for(let j=-cols; j<=cols; j++){
                this.hidePoints.push({"x":j,"y":i});
            }
        }

        this.hidePointsNum = this.hidePoints.length;
        console.log(this.hidePoints, "num:", this.hidePointsNum);
    },

    onTouchStart(e){
        this.scratch(e);
    },

    onTouchMove(e){
        this.scratch(e);
    },

    onTouchEnd(e){
        this.scratch(e);
    },

    onTouchCancel(e){

    },

    // 刮开一小块区域
    scratch(e){
        // 获取触摸点相对于当前节点的锚点坐标
        let pos = this.getPos(e);

        // 在此坐标附近绘制一个图形
        this.addShape(pos);

        // 将刮开区域这个点从数组hidePoints中移除
        this.calcScratchArea(pos);
    },

    calcScratchArea(pos){
        // 将实际触摸坐标点转换为网格坐标点
        let x = Math.floor(pos.x / (this.scratchRadiuX*2));
        let y = Math.floor(pos.y /(this.scratchRadiuY*2));
        for(let i=0; i<this.hidePoints.length; i++){
            if(x===this.hidePoints[i].x && y===this.hidePoints[i].y){
                this.hidePoints.splice(i,1);
                console.log("remove:",this.hidePoints);
                break;
            }
        }
        // 判断刮开区域的面积
        if(this.hidePoints.length/this.hidePointsNum < 0.6){
            this.showDialog();
        }
    },

    showDialog(){
        let prompt = this.resultDialog.getChildByName("Bg").getChildByName("Info");
        prompt.getComponent(cc.Label).string = this.prizeItemLabel.string;

        this.resultDialog.active = true;

    },

    // 在pos位置绘制一个图形，刮开一块区域
    addShape(pos){
        //console.log("pos:", pos);
        //console.log("Mask:", this.mask);
        let graphics = this.mask._graphics;
        graphics.fillRect(pos.x, pos.y, this.scratchRadiuX*2, this.scratchRadiuY*2);
    },

    // 获取触摸位置相对于当前节点的锚点的坐标
    getPos(e){
        return this.node.convertToNodeSpaceAR(e.getLocation());
    },

    start () {
        let res = Math.floor(Math.random()*4);  // [0,3]
        this.initPrize(res);
    },

    initPrize(res){
        this.prizeInfo = ["一等奖\n彩电一台","二等奖\n手机一部","三等奖\n流量100G","再来一次"];
        this.prizeItemLabel = cc.find("Canvas/PrizeRoot/PrizeItem").getComponent(cc.Label);
        // 判断res是否会超出奖项的索引
        this.prizeItemLabel.string = this.prizeInfo[res];
    },

    // update (dt) {},
});
