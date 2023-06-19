import joystick from "./joystick";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SnakeCtrl extends cc.Component {

    @property(joystick)
    private stick: joystick = null; // 游戏遥感;

    private speed: number = 100; // 贪吃蛇的速度;

    private FIXED_TIME: number = 0.016; // 
    private roadPoints: Array<cc.Vec2> = null; // 存放我们的路径点;
    private snakePointIndex: Array<number> = null; // 每节蛇当前走到那个点的索引

    private nowTime: number = 0;

    start(): void {
        console.log(SnakeCtrl)
        
        var blockLen = this.FIXED_TIME * this.speed;
        var ypos = -125;
        var snakeLen = (this.node.childrenCount - 1) * 25;
        var len = snakeLen * 2; // 采集足够的点;

        this.roadPoints = [];
        this.snakePointIndex = [];

        var totalTime = len / this.speed;
        var nowTime = 0;

        // 采集到了我开始的时候的点的数据;
        // 提示路径点;寻路，你要打出预先的路径点出来;
        while(nowTime < totalTime) {
            this.roadPoints.push(cc.v2(0, ypos));
            ypos += blockLen;
            nowTime += this.FIXED_TIME;
        }
        // end

        var numPoints = Math.floor(25 / blockLen);
        if (numPoints <= 0) {
            numPoints = 1;
        }

        for(var i = 0; i < this.node.childrenCount; i ++) {
            var index = this.roadPoints.length - 1 - i * numPoints;
            this.node.children[i].setPosition(this.roadPoints[index]);
            this.snakePointIndex.push(index);
        }

        this.nowTime = 0;
    }

    fixedUpdate(dt: number): void {
        if (this.stick.dir.x === 0 && this.stick.dir.y === 0) {
            return;
        }

        // 
        var pos = this.node.children[0].getPosition();
        var vx = this.speed * this.stick.dir.x;
        var vy = this.speed * this.stick.dir.y;
        pos.x += (vx * dt);
        pos.y += (vy * dt);
        this.roadPoints.push(pos);
        this.node.children[0].setPosition(pos);

        var r = Math.atan2(this.stick.dir.y, this.stick.dir.x);
        var degree = r * 180 / Math.PI;
        degree -= 90;
        this.node.children[0].angle = degree;

        for(var i = 1; i < this.node.childrenCount; i ++) {
            this.snakePointIndex[i] ++;
            var pointIndex = this.snakePointIndex[i];
            this.node.children[i].setPosition(this.roadPoints[pointIndex]);
        }
    }

    update(dt: number): void {
        this.nowTime += dt;
        while(this.nowTime > this.FIXED_TIME) {
            this.fixedUpdate(this.FIXED_TIME);
            this.nowTime -= this.FIXED_TIME;
        }
    }
}
