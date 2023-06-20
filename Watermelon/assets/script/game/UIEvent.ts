
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SceneAsset)
    lastScene:cc.SceneAsset=null

    backToStart(){
        cc.director.runScene(this.lastScene);
    }

    resetGame(){
        cc.game.restart()
    }

    onLoad () {
        this.node.on('backToStart',this.backToStart,this);
        this.node.on('resetGame',this.resetGame,this);
    }

    // start () {

    // }

    // update (dt) {}
}
