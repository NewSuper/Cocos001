// cc: cocos creator
// _decorator: 注解、装饰器名字空间
// ccclass: 注解/装饰一个类是一个组件类;
// property: 注解一个类的数据成员绑定到我们的编辑器;
// 装饰器 @开头
// cc.Component: 所有的组件类都继承自cc.Component
// export default: 导出这个类  import xxxxxx from "GameMgr"

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {

    // 权限 名字:类型 = 默认值
    @property
    private isDebug: boolean = false;

    // 权限 名字(参数名字: 类型, ...): 返回值类型(void)
    public foo(lhs: number, rhs: number): void {

    }

    start(): void {
        
    }

    // |=============|===============|=====dt======|
    // dt:迭代世界的变化，100,  100 * dt;
    // 速度 * 时间来控制;  update  更新某个变量;
    update(dt: number): void {
    }
}   
