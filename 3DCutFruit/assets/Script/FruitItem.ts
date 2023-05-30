import { _decorator, Component, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum FruitState{
    Ready = 1,
    Running =2,
    Sliced =3,
    Dead = 4
}

@ccclass('FruitItem')
export class FruitItem extends Component {
    private config:any = null;

    private initScale:number = 0;

    private deadLine:number = -11;//水果死掉的线
    private state:FruitState = FruitState.Ready;
    private vx:number = 0;
    private vy :number = 0;
    private Gravity:number = -10;
    private wSpeed:number = 90;

    initFruit(fruitConfig:any) {
        this.initScale = this.node.scale.x;
        this.config = fruitConfig;
        this.state = FruitState.Ready;

        //设置一些初始化逻辑
        var scale = this.initScale * parseFloat(fruitConfig.scale);
        this.node.setScale(v3(scale,scale,scale));
    }

    //抛出来
    throwFruitOut(force:Vec3){
        if(this.state !== FruitState.Ready){
           return;
        }
    
        this.vx = force.x  * 0.1;
        this.vy = force.y  * 0.1;
        this.state = FruitState.Running;
    } 
    
    fruitTotalUpdate(dt:number){
      //抛物线运动的迭代
      var pos = this.node.getPosition();
      pos.x += (this.vx * dt);
      pos.y += (this.vy * dt + this.Gravity * dt * dt *0.5);
      this.vy += (this.Gravity*dt);
      this.node.setPosition(pos);

      //自转
      var degres = this.wSpeed * dt;
      var rot:Vec3 = this.node.eulerAngles;
      rot.z += degres;
      this.node.setRotationFromEuler(rot);

      if(pos.y <= this.deadLine){
          console.log("remove")
          this.state = FruitState.Dead;
          this.node.destroy();
      }
    }  

    update(deltaTime: number) {
        if(this.state === FruitState.Running){
            this.fruitTotalUpdate(deltaTime);
        }
    }
}


