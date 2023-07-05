const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    //要调转的场景
    @property({
        type: cc.SceneAsset,
        displayName:'跳转的场景'
    })
    sceneAsset: cc.SceneAsset = null;

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    replaceScene(){
        cc.director.runScene(this.sceneAsset);
    }
}
