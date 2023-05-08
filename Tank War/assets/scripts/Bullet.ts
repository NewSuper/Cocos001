// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property
    speed:number = 200


    start () {
    
    }

    update (dt) { 
        let rad = (this.node.angle + 90) * Math.PI / 180
        this.node.x += this.speed * dt * Math.cos(rad)
        this.node.y += this.speed * dt * Math.sin(rad)  //倒着飞就是 -=
    }
}
