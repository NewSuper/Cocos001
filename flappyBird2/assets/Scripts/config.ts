const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    protected onEnable(): void {
        let physics=cc.director.getPhysicsManager();
        physics.enabled=true;
    }

    protected onDisable(): void {
        let physics=cc.director.getPhysicsManager();
        physics.enabled=false;
    }

}
