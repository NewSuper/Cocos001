
const { ccclass, property } = cc._decorator;

@ccclass
export default class Level extends cc.Component {

    @property(cc.SpriteFrame)
    unlockedPic: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    lockedPic: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    greyStarPic: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    yellowStarPic: cc.SpriteFrame = null;



    onLoad () {
         // 触摸监听
         this.node.on('touchstart', this.onTouchStart, this);
    }

    start() {

    }

    // update (dt) {}

    changePic(levelState:string, num:number) {
        // 更改图片
        if (levelState == 'UNLOCKED') {
            // 解锁关卡
            this.node.children[0].active = true;
            this.node.children[0].getComponent(cc.Label).string = num.toString();
            this.node.getComponent(cc.Sprite).spriteFrame = this.unlockedPic;
            this.node.children[1].getComponent(cc.Sprite).spriteFrame = this.greyStarPic;
        }
        else if (levelState == 'PASSED') {
            // 通关
            this.node.children[0].active = true;
            this.node.children[0].getComponent(cc.Label).string = num.toString();
            this.node.getComponent(cc.Sprite).spriteFrame = this.unlockedPic;
            this.node.children[1].getComponent(cc.Sprite).spriteFrame = this.yellowStarPic;

        }
        else if (levelState == 'LOCKED') {
            // 关卡未解锁
            this.node.getComponent(cc.Sprite).spriteFrame = this.lockedPic;
            this.node.children[1].getComponent(cc.Sprite).spriteFrame = this.greyStarPic;
        }     
    }

    onTouchStart () {        
        if (this.node.attr['levelState'] == 'LOCKED')
            return;        
        // 将目标关卡信息存入本地，在Game.js中取出
        cc.sys.localStorage.setItem('currentLevelInfo', JSON.stringify(this.node.attr));
        cc.director.loadScene('1');
    }
}
