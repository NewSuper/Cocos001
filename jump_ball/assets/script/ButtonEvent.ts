
import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

 
@ccclass('ButtonEvent')
export class ButtonEvent extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    tryAgent(){
        director.loadScene('fight');
    }
}