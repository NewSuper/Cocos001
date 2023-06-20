const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // onLoad () {}

    onEnable () {
        let physicsManager=cc.director.getPhysicsManager();
        physicsManager.enabled=true;
    }

    onDisable(){
        let physicsManager=cc.director.getPhysicsManager();
        physicsManager.enabled=true;
    }

    // update (dt) {}
}
