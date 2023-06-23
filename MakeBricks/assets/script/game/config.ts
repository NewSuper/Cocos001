
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    onLoad () {
        let physicManager=cc.director.getPhysicsManager();
        //启动物理组件
        physicManager.enabled=true;
    }
}
