const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    text: string = '';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //预先加载场景
        cc.director.preloadScene(this.text);
    }

    // update (dt) {}

    load(){
        cc.director.loadScene(this.text);
    }
}
