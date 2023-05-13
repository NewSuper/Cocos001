import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {

    start() {
        const a="123"
        const b=`${a}`
        const c='${a}'
        console.log(b)
        console.log(c)
    }

    update(deltaTime: number) {

    }
}

