const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad () {
        let manager = cc.director.getCollisionManager();
        manager.enabled=true;
        // manager.enabledDebugDraw=true;
    }


}
