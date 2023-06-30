
const {ccclass, property} = cc._decorator;


//皮肤替换功能  TODO
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    bird: cc.Sprite = null;

    @property(cc.Animation)
    birdAnimation:cc.Animation=null;

    @property(cc.Sprite)
    bg:cc.Sprite=null;

    @property(cc.Sprite)
    land:cc.Sprite=null;


    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
