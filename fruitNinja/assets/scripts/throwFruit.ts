const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.Prefab])
    fruitPrefab: cc.Prefab[] = [];

    @property(cc.Node)
    range: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.schedule( this.startGame,2.5)
    }

    startGame(){
        let interval=this.random(0.1,0.25);     //水果连续抛的间隔
        let times= this.random(2,5);            //连续抛出的水果
        this.schedule(()=>{
            let fruit=this.spawnFruit();
            this.throwFruit(fruit);
        } ,interval,times);
    }

    //抛水果
    throwFruit(fruit:cc.Node){
        let rigid=fruit.getComponent(cc.RigidBody);
        rigid.angularVelocity=this.random(-90,90);

        //抛射角度
        let target=cc.v3();
        let box=this.range.getBoundingBox();
        target.x=this.random(box.xMin,box.xMax);
        target.x+=fruit.x;
        target.y=this.range.y;

        //y:10 x:5      normalize  2:1
        //抛射力度
        let dir=target.sub(fruit.position).normalize();
        let force=this.random(700,800);
        if(target.x>0){
            dir.x= -Math.abs(dir.x);              //Math.abs 取绝对值
        }
        else{
            dir.x= Math.abs(dir.x);  
        }
        //抛出  =  方向*力度
        rigid.linearVelocity=cc.v2(dir.mul(force));
    }

    //生成水果
    spawnFruit(){
        let i=this.random(0,this.fruitPrefab.length) | 0;
        let fruit=cc.instantiate(this.fruitPrefab[i]);
        let width=cc.winSize.width;     //获取屏幕宽度
        fruit.x=this.random(-width/2,width/2);
        fruit.y=-cc.winSize.height/2;
        fruit.parent=this.node;     //this.node.addChild(fruit)
        return fruit;
    }

    // update (dt) {}

    /**
     * 生成随机数
     * @param min 最小值
     * @param max 最大值
     */
    random(min:number,max:number){
        return Math.random()*(max-min)+min;
    }
}
