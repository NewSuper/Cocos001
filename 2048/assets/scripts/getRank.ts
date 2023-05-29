
import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('getRank')
export class getRank extends Component {

    onLoad() {
       
    }

    start() {
        let score = localStorage.getItem("best")
        //console.log(score)
        wx.getOpenDataContext().postMessage({
            type:"engine",
            event:"viewport",
            score: score,
        })
        this.node.parent.getChildByName("more").on(Node.EventType.TOUCH_START, () => {
            director.loadScene("game")
        }, this)
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

