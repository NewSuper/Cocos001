// Cocos creator ---> cc模块(名字空间) 
// 两个装饰器
// ccclass描述的时候这个类时一个组件类,  property装饰器描述的是变量要绑定到我们的编辑器上;
// cc.Component--->cocos 组件类的基类;
// ts 每个代码模块，可以导出多个对象(数，变量，函数，类)  export;
// 引入这些对象的时候，import;
// ts 的每个代码模块 有并且只有一个default默认导出;  符号---》default导出出来;
// @：后面告诉装载的代码  装饰器
// 定义类数据成员;
const {ccclass, property} = cc._decorator;

@ccclass 
export default class game_mgr extends cc.Component {

    // 权限 名字: 类型 = 默认值(可选)
    // 如果你不写权限---> public;
    @property
    private is_debug: boolean = false;
    
    // 类的成员函数
    // 权限 函数名字(参数:类型, ...): 返回值类型(void)
    public test_func(lhs: number, rhs: number): void {

    }


    start (): void {
        
    }

    // |-------|-------|----dt----|
    update (dt: number): void {
        
    }
}
