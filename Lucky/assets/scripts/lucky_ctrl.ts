
const {ccclass, property} = cc._decorator;

class State {
    public static Ready: number = 1; // 初始状态;
    public static Running: number = 2; // 
}

@ccclass
export default class lucky_ctrl extends cc.Component {

    private state: number = State.Ready;
    private start_index: number = 0; // 开始光圈所在位置
    private end_index: number = 1; // 结果所在的位置

    @property(cc.Node)
    private item_root: cc.Node = null;

    @property(cc.Node)
    private running_item: cc.Node = null;

    private road_point: Array<any> = null;
    private speed: number = 5000;
    private next_step: number = 1;
    private vx: number = 0;
    private vy: number = 0;
    private walk_time: number = 0;
    private passed_time: number = 0;
    private delta_a: number = 0;

    start (): void {
        // 给黄色的光圈一个初始化结果
        this.start_index = Math.random() * 12;
        this.start_index = Math.floor(this.start_index);
        this.running_item.setPosition(this.item_root.children[this.start_index].getPosition());
    }

    update (dt: number):void {
        if (this.state != State.Running) {
            return;
        }

        this.passed_time += dt;
        if (this.passed_time > this.walk_time) {
            dt -= (this.passed_time - this.walk_time);
        }

        this.running_item.x += (this.vx * dt);
        this.running_item.y += (this.vy * dt);

        if (this.passed_time >= this.walk_time) {
            this.next_step ++;
            this.speed -= this.delta_a;
            this.walk_to_next();
        }
    }

    show_anim(): void {
        var round: number = 3 + Math.random() * 2;
        round = Math.floor(round);

        this.road_point = [];
        for(var j = 0; j < round; j ++) {
            for(var i = this.start_index; i < this.item_root.childrenCount; i ++) {
                this.road_point.push(this.item_root.children[i].getPosition());
            }
    
            for(var i = 0; i < this.start_index; i ++) {
                this.road_point.push(this.item_root.children[i].getPosition());
            }
        }
        
        // start, end;
        if (this.start_index < this.end_index) {
            for(var i = this.start_index; i <= this.end_index; i ++) {
                this.road_point.push(this.item_root.children[i].getPosition());
            }
        }
        else {
            for(var i = this.start_index; i < this.item_root.childrenCount; i ++) {
                this.road_point.push(this.item_root.children[i].getPosition());
            }
    
            for(var i = 0; i <= this.end_index; i ++) {
                this.road_point.push(this.item_root.children[i].getPosition());
            }
        }

        
        this.walk_on_road();
    }

    walk_on_road(): void {
        if (this.road_point.length < 2) {
            return;
        }

        this.speed = 5000;
        this.delta_a = this.speed / (this.road_point.length - 1);
        this.next_step = 1;
        this.running_item.setPosition(this.road_point[0]);


        this.walk_to_next();
    }

    walk_to_next(): void {
        if (this.next_step >= this.road_point.length) { // 走完了;
            this.state = State.Ready;
            this.start_index = this.end_index;
            return;
        }

        var src: cc.Vec2 = this.running_item.getPosition();
        var dst: cc.Vec2 = this.road_point[this.next_step];

        var dir: cc.Vec2 = dst.sub(src);
        var len: number = dir.mag();
        if (len <= 0) {
            this.next_step ++;
            this.walk_to_next();
            return;
        }

        this.vx = this.speed * dir.x / len;
        this.vy = this.speed * dir.y / len;

        this.walk_time = len / this.speed;
        this.passed_time = 0;
    }

    public on_start_click(): void {
        if (this.state != State.Ready) {
            return;
        }

        this.state = State.Running;

        this.end_index = Math.random() * 12;
        this.end_index = Math.floor(this.end_index); // [0, 11]
        console.log("#################", this.end_index + 1);
        this.show_anim();
    }
}
