import Enemy from "./enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    enemyGroup: cc.Node = null

    @property([cc.Prefab])
    enemy: Array<cc.Prefab> = [];

    onLoad() {
        this.node.on('destroyAllEnemy', this.destroyAllEnemy, this);
    }

    start() {
        this.schedule(this.spawnEnemy, 0.5)
    }

    destroyAllEnemy() {
        for (let enemy of this.enemyGroup.children) {
            enemy.emit('die');
        }
    }

    //生成敌机
    spawnEnemy() {
        let r: number = parseInt((Math.random() * this.enemy.length).toString())
        let enemy = cc.instantiate(this.enemy[r])
        enemy.y = 480;
        enemy.x = Math.random() * cc.winSize.width - cc.winSize.width / 2;
        this.enemyGroup.addChild(enemy)
    }

    // update (dt) {}
}
