const score = require("GameScore");
cc.Class({
    extends: cc.Component,

    properties: {
        score : {type:cc.Label, default:null, tooltip:"得分显示Label组件"},
        kill : {type:cc.Label, default:null, tooltip:"击杀数量显示Label组件"},
        timeBar : {type:cc.ProgressBar, default:null, tooltip:"时间进度条"},

        mosPrefab : {type:cc.Prefab, default:null, tooltip:"蚊子的预制体"},
        mosRoot : {type:cc.Node, default:null, tooltip:"蚊子的根节点"},
    },

    onLoad () {
        let limitTime = score.time;     // 游戏限时，总时间
        this.schedule(function(){
            if(score.time > 0){
                score.time--;       // 倒计时
                this.timeBar.progress = score.time / limitTime;
                let mosNode = cc.instantiate(this.mosPrefab);
                this.mosRoot.addChild(mosNode);
            }else{
                cc.audioEngine.pauseMusic();        // 停止播放音效
                console.log("GameOver!!");
            }
        }, 1);
    },

    start () {
        // 连杀的规则：3秒之内连续击杀才记数，超过三秒重新开始计数
        this.schedule(function(){
            score.continuityKill = 0;
        }, 3);
    },

    update (dt) {
        this.score.string = score.killScore;
        this.kill.string = score.kill;
    },
});
