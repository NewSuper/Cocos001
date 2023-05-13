import { _decorator, Component, director, Node, ProgressBar, resources } from 'cc';
import { SCEEN_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('LoadManager')
export class LoadManager extends Component {
    @property(ProgressBar)
    bar:ProgressBar=null
    protected onLoad(): void {
        resources.preloadDir('texture',(cur,total)=>{
            this.bar.progress=cur/total
        },()=>{
            director.loadScene(SCEEN_ENUM.start)
        })
    }

}

