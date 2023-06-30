
const {ccclass, property} = cc._decorator;


// 水管
@ccclass
export default class SpawnPumple extends cc.Component {

    @property(cc.Prefab)
    pumplePrefab: cc.Prefab = null;

    @property(cc.Node)
    pumpLayer:cc.Node=null

    onLoad () {
        this.node.on('startGame',this.startGame,this);
    }

    startGame(){
      this.schedule(this.spawnPumple,1);
    }


    spawnPumple(){
        let pumple=cc.instantiate(this.pumplePrefab);
        this.pumpLayer.addChild(pumple);
        pumple.emit('init');
    }

    // update (dt) {}
}
