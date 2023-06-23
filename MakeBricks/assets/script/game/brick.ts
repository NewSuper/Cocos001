const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteAtlas)
    spriteAltas: cc.SpriteAtlas = null;

    // onLoad () {}

    start() {
        this.randomSprite();
    }

     //随机精灵
     randomSprite(){
        let n = 'brick' + (Math.random() * 4 | 0);
        cc.log('random:' + n)
        let sp = this.node.getComponent(cc.Sprite);
        sp.spriteFrame = this.spriteAltas.getSpriteFrame(n)
    }

    // 获取随机颜色
    _randomColor () {
        let red = Math.round(Math.random()*255);
        let green = Math.round(Math.random()*255);
        let blue = Math.round(Math.random()*255);
        return new cc.Color(red, green, blue);
    }

    
}
