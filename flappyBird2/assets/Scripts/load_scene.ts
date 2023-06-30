
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    sceneName: string = 'game1';


    onLoad () {
        cc.director.preloadScene(this.sceneName);
    }

    // update (dt) {}

    repeatScene(){
        cc.log('载入新场景')
        cc.director.loadScene(this.sceneName);
    }
}
