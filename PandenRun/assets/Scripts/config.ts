const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    onLoad () {
        let physics=cc.director.getPhysicsManager();
        physics.enabled=true;
    }

    start () {

    }

    // update (dt) {}
}
