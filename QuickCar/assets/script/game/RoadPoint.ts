import { _decorator, Component, Node, Vec3, Enum, macro } from "cc";
const { ccclass, property } = _decorator;

/***
 * 1.点击开始界面，游戏开始，此时切换到游戏界面，并播放背景音乐
 * 2.点按屏幕任意处小车加速，松开手刹并根据当前车速播放刹车特效和刹车音效
 * 3.到达制定地点接收乘客，播放乘客动画并更新相对应界面订单进度
 * 4.第一次接乘客时触发关卡内AI 小车运作
 * 5.送乘客时播放金币奖励特效和音效
 * 6.到达终点或出车祸结束游戏，进入结算界面，出车祸不予奖励
 * 7.结算界面点击领取更新自身金币数量并回到主界面
 */
enum ROAD_POINT_TYPE {
    NORMAL = 1,  // 默认点
    START, 
    GREETING,//接客点
    GOODBYE,//送客点
    END,
    AI_START,//AI小车
}

Enum(ROAD_POINT_TYPE); //序列化时使用，否则机器报错

enum ROAD_MOVE_TYPE {  //移动类型
    LINE = 1,//直线
    BEND,//弯路
}

Enum(ROAD_MOVE_TYPE);

@ccclass("RoadPoint")
export class RoadPoint extends Component {
    public static RoadPointType = ROAD_POINT_TYPE;
    public static RoadMoveType = ROAD_MOVE_TYPE;

    @property({
        type: ROAD_POINT_TYPE,
        displayOrder: 1,  //displayOrder  排序时使用
    })
    type = ROAD_POINT_TYPE.NORMAL;

    @property({
        type: Node,
        displayOrder: 2,
    })
    public nextStation: Node  | null= null;

    @property({ type: ROAD_MOVE_TYPE, displayOrder: 3})
    moveType = ROAD_MOVE_TYPE.LINE;
    
    // 使用 visible  判断组件中哪些属性可显示，只有AI_START 可显示所有属性
    @property({displayOrder: 4, visible:  function (this: RoadPoint){
        return this.moveType === ROAD_MOVE_TYPE.BEND;
    }})
    clockwise: boolean = false;  //顺时针

    @property({
        visible: function (this: RoadPoint) {
            return this.type === ROAD_POINT_TYPE.GREETING || this.type === ROAD_POINT_TYPE.GOODBYE;
        }
    })
    direction = new Vec3(); //方向

    @property({ displayOrder: 5, visible:  function (this: RoadPoint){
        return this.type === ROAD_POINT_TYPE.AI_START;
    }})
    delayTime = 0; //延迟时间

    @property({ displayOrder: 6, visible:  function (this: RoadPoint){
        return this.type === ROAD_POINT_TYPE.AI_START;
    }})
    interval = 3; //间隔

    @property({displayOrder: 7, visible:  function (this: RoadPoint){
        return this.type === ROAD_POINT_TYPE.AI_START;
    }})
    speed = 0.05;//速度

    @property({ displayOrder: 8, visible:  function (this: RoadPoint){
        return this.type === ROAD_POINT_TYPE.AI_START;
    }})
    cars = '201';//车的类型


    /***以下为关于我们当前这条路径，它整个小车要发车的运作部分 ，每隔多少时间产生一辆Ai 小车*/
    private _arrCars: string[] = []; 
    private _cd: Function = null;

    public start(){
        this._arrCars = this.cars.split(',');
    }

    public startSchedule(cd: Function){
        if(this.type !== ROAD_POINT_TYPE.AI_START){
            return;
        }

        this.stopSchedule();
        this._cd = cd;
        this.scheduleOnce(this._startDelay, this.delayTime);
    }

    public stopSchedule(){
        this.unschedule(this._startDelay);
        this.unschedule(this._scheduleCD);
    }

    private _startDelay(){
        this._scheduleCD();
        this.schedule(this._scheduleCD, this.interval, macro.REPEAT_FOREVER);
    }
    
    private _scheduleCD(){
        const index = Math.floor(Math.random() * this._arrCars.length);
        if(this._cd){
            this._cd(this, this._arrCars[index]);
        }
    }
}



