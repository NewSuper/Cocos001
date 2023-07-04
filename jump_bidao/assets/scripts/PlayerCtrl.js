cc.Class({
    extends: cc.Component,

    properties: {
        diaAudio : {type:cc.AudioClip, default:null, tooltip:"玩家死亡音效"},
    },

    onCollisionEnter(other, self) {
        if(other.node.group === "Dici"){
            console.log("contact Dici");
            this.gameOver();
        }else if(other.node.group === "Knife"){
            console.log("contact Knife");
            this.gameOver();
        }
    },

    gameOver(){
        cc.audioEngine.play(this.diaAudio, false, 1);
        this.node.removeFromParent();        // 橡皮怪消失
        this.scheduleOnce(function(){
            cc.director.loadScene("GameScene");
        }.bind(this),1);

    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
