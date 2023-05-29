
import { _decorator, Component, Node, Color, Sprite, Label } from 'cc';
const { ccclass, property } = _decorator;

var colors = []
colors[0] = new Color(198,184,172,255)
colors[2] = new Color(235,224,213,255)
colors[4] = new Color(236,224,200,255)
colors[8] = new Color(242,177,121,255)
colors[16] = new Color(245,149,99,255)
colors[32] = new Color(247,124,95,255)
colors[64] = new Color(245,93,59,255)
colors[128] = new Color(235,206,112,255)
colors[256] = new Color(235,202,96,255)
colors[512] = new Color(236,199,79,255)
colors[1024] = new Color(235,196,63,255)
colors[2048] = new Color(236,193,45,255)
colors[4096] = new Color(239,103,108,255)
colors[8192] = new Color(236,77,88,255)
colors[16384] = new Color(243,64,64,255)
colors[32768] = new Color(112,179,212,255)
colors[65536] = new Color(93,160,221,255)
colors[131072] = new Color(25,128,203,255)
 
@ccclass('blockControl')
export class blockControl extends Component {
   

    start () {
        // [3]
    }

    setNumber(num){
        //方块背景颜色
        this.node.getChildByName("bg").getComponent(Sprite).color = colors[num]
        if(num == 0){//空方块隐藏数字
            this.node.getChildByName("num").active = false
        }
        //字体大小
        let fontSize = 40
        if(num > 99999){
            fontSize -= 15
        }
        else if(num > 9999){
            fontSize -= 12
        }
        else if(num > 999){
            fontSize -= 9
        }
        else if(num > 99){
            fontSize -= 6
        }
        //设置方块数字及字体大小
        this.node.getChildByName("num").getComponent(Label).string = num + ""
        this.node.getChildByName("num").getComponent(Label).fontSize = fontSize     
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

