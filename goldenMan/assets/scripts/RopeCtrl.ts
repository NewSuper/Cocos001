const {ccclass, property} = cc._decorator;

// 矿工绳子的状态
const enum State{
    Idle, Grow, Back, BackWithTarget, Stop
}

class GameConfig{
    public static LHS_Degree : number = -65;
    public static RHS_Degree : number = 65;
    public static Idle_Len : number = 150;
}

@ccclass
export default class RopeCtrl extends cc.Component {

    @property({type:cc.Float, tooltip:"绳子的左右摇摆速度"})
    rollSpeed : number = 120;

    @property({type:cc.Float, tooltip:"绳子的生长速度"})
    growSpeed : number = 200;

    @property({type:cc.Float, tooltip:"绳子的收回的速度"})
    backSpeed : number = 300;


    private state : number = State.Idle;
    private nowDegree : number = 0;

    private nowLen : number = GameConfig.Idle_Len;

    private hand : cc.Node = null;
    // onLoad () {}

    start () {
        this.hand = this.node.getChildByName("game_hand");
        this.setRopeLength(GameConfig.Idle_Len);
    }

    update (dt) {
        if(this.state === State.Idle){
            this.idleUpdate(dt);
        }else if(this.state === State.Grow){
            this.growUpdate(dt);
        }else if(this.state === State.Back){
            this.backUpdate(dt);
        }

    }

    backUpdate(dt){
        this.nowLen -= this.backSpeed * dt;
        this.setRopeLength(this.nowLen);
        if(this.nowLen <= GameConfig.Idle_Len){
            this.nowLen = GameConfig.Idle_Len;
            this.state = State.Idle;
        }        
    }

    // 设置绳子长度的方法
    private setRopeLength(len : number) : void{
        this.node.height = len;
        this.hand.y = -(len + this.hand.height/2);
    }

    // 碰撞之后收回绳子的方法
    backWithNothing(){
        if(this.state !== State.Grow){
            return;
        }
        this.state = State.Back;
    }

    // 抛出绳子的接口方法
    public throwRope() : void{
        if(this.state !== State.Idle){
            return;
        }
        this.state = State.Grow;
    }

    private growUpdate(dt : number) : void{
        this.nowLen += this.growSpeed * dt;
        this.setRopeLength(this.nowLen);
    }

    private idleUpdate(dt : number) : void{
        this.nowDegree += (this.rollSpeed * dt);
        this.node.angle = this.nowDegree;

        // 判断摇摆方向的改变
        if(this.nowDegree <= GameConfig.LHS_Degree && this.rollSpeed<0){
            this.rollSpeed = -this.rollSpeed;
        }else if(this.nowDegree >= GameConfig.RHS_Degree && this.rollSpeed > 0){
            this.rollSpeed = -this.rollSpeed;
        }
    }
}
