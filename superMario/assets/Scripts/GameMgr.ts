// cc: cocos creator;
// cc._decorator: 装饰器/注解 名字空间;
// ccclass: 装饰注解一个类是一个组件类;
// property: 装饰注解一个类的数据成员，要绑定到编辑器;
// @开头表示装饰器或注解;
const {ccclass, property} = cc._decorator;

// cc.Component: 组件类的基类;

@ccclass
export default class GameMgr extends cc.Component {

    // 权限 名字: 类型 = 默认值;
    @property
    private isDebug: boolean = false;

    start(): void {
    }

    // |=========|======dt=======|
    // 100 , 速度 * dt;
    update(dt: number): void {
    }
}
