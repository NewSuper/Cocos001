const score = require("GameScore");
cc.Class({
    extends: cc.Component,

    properties: {
        hitImg : {type:cc.SpriteFrame, default:null, tooltip:"暴血的图片"},
        firstBlood : {type:cc.AudioClip, default:null, tooltip:"第一滴血的音效"},
        doubleKill : {type:cc.AudioClip, default:null, tooltip:"二连击的音效"},
        tripleKill : {type:cc.AudioClip, default:null, tooltip:"3连击的音效"},
        ultraKill : {type:cc.AudioClip, default:null, tooltip:"4连击的音效"},
        rampage : {type:cc.AudioClip, default:null, tooltip:"5连击的音效"},
    },

    onLoad () {
        let self = this;
        let flag = true;        // 控制蚊子飞行的开关
        if(flag){
            let screenHeight = cc.winSize.height;
            let screenWidth = cc.winSize.width;
            let x = this.node.x;
            let y = Math.random()*screenHeight - screenHeight/2;
            self.node.setPosition(x, y);        // 将蚊子放到起始位置
            
            let x1 = x + Math.random()*screenWidth;
            let y1 = Math.random()*screenHeight - screenHeight/2;

            let x2 = x1 + Math.random()*screenWidth;
            let y2 = Math.random()*screenHeight - screenHeight/2;

            let x3 = screenWidth/2 + this.node.width;
            let y3 = Math.random()*screenHeight - screenHeight/2;

            let time = Math.random()*2 + 1;     // [1,3)

            let m1 = cc.moveTo(time, cc.v2(x1,y1));
            let m2 = cc.moveTo(time, cc.v2(x2,y2));     
            let m3 = cc.moveTo(time, cc.v2(x3,y3));  

            let fOut = cc.fadeOut(1);
            let finished = cc.callFunc(function(){
                if(self != null && self.node !== null){
                    self.node.destroy();
                }
            }, this, 100);

            let action = cc.sequence([m1, m2, m3, fOut, finished]);

            self.node.runAction(action);
        }

        this.node.on(cc.Node.EventType.TOUCH_START, function(){
            // 如果在飞行，就拍打蚊子
            if(flag){
                // 停止扇动翅膀
                self.node.getComponent(cc.Animation).stop();
                // 蚊子暴血
                self.node.getComponent(cc.Sprite).spriteFrame = self.hitImg;
                flag = false;       // 暴血后就不能再飞行移动了
                self.node.stopAllActions();

                // 加分
                score.scoreAdd(1);
                if(score.kill === 1){
                    cc.audioEngine.playEffect(self.firstBlood);
                }
                switch(score.continuityKill){
                    case 2 : cc.audioEngine.playEffect(self.doubleKill);break;
                    case 3 : cc.audioEngine.playEffect(self.tripleKill);break;
                    case 4 : cc.audioEngine.playEffect(self.ultraKill);break;
                    case 5 : cc.audioEngine.playEffect(self.rampage);break;
                    default:break;
                }

                // 销毁当前蚊子节点
                setTimeout(function(){
                    if(self != null && self.node !== null){
                        self.node.destroy();
                    }                    
                    //console.log("destory!");
                }, 1000);
            }
        }, this);
    },

    start () {

    },

    update (dt) {
        if(score.time <= 0){
            if(self != null && self.node !== null){
                this.node.destroy();
            }            
        }
    },

    onDestroy(){
        //console.log("自我销毁！！", score.time);
    },
});
