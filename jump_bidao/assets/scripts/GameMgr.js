cc.Class({
    extends: cc.Component,

    properties: {
        player : {type:cc.Node, default:null, tooltip:"玩家节点"},
        jumpAudio : {type:cc.AudioClip, default:null, tooltip:"玩家跳跃的音效"},
    },

    onLoad () {
        cc.director.getCollisionManager().enabled = true;       // 开启碰撞引擎
        this.isJumping = false;     // 是否正在跳跃
        this.playerPos = this.player.getPosition();     // 玩家开始的坐标，便于计算是左右跳跃还是同侧跳跃
        this.jumpMaxX = Math.abs(this.player.x) * 2;    // 玩家最大跳跃距离
        this.jumpMinX = 200;                            // 玩家最小跳跃距离
        this.node.on(cc.Node.EventType.TOUCH_START, this.onPlayerJump.bind(this), this);
    },

    onPlayerJump(e){
        if(this.isJumping === true){
            return;
        }
        this.isJumping = true;
        cc.audioEngine.play(this.jumpAudio, false, 1);
        // 判断到底是同侧跳跃还是 跳到对面去
        let touchPos = e.getLocation();
        touchPos = this.node.convertToNodeSpaceAR(touchPos);
        // if(this.player == null || this.palyer == undefined){
        //     return;
        // }
        this.playerPos = this.player.getPosition();

        let offSet = touchPos.sub(this.playerPos);
        // 跳跃的方向
        let jumpDir = offSet.x > 0 ? 1 : -1;
        // 同侧跳跃和跳到对侧的处理
        if(Math.abs(offSet.x) >= this.node.width/2){
            this.playerJumpToAntherSide(jumpDir);
        }else{
            this.playerJumpOnSide(jumpDir);
        }
        //this.isJumping = false;
    },

    playerJumpToAntherSide(jumpDir){
        let jumpX = jumpDir * this.jumpMaxX;
        let jump = cc.moveBy(0.3, cc.v2(jumpX, 0), 0.1);
        let rot = cc.rotateBy(0.2, 180);       

        let endFunc = cc.callFunc(function(){
            this.isJumping = false;
        }.bind(this), 0.6);

        let action = cc.spawn(jump, rot);

        let seq = cc.sequence([action, endFunc]);

        this.player.runAction(seq);
    },

    playerJumpOnSide(jumpDir){
        let jumpX = jumpDir * this.jumpMinX;
        let jump = cc.moveBy(0.2, cc.v2(jumpX, 0), 0.1);
        let back = cc.moveBy(0.2, cc.v2(-jumpX, 0), 0);

        let endFunc = cc.callFunc(function(){
            this.isJumping = false;
        }.bind(this), 0.6);

        let seq = cc.sequence([jump, back, endFunc]);
        this.player.runAction(seq);
    },

    start () {

    },

    // update (dt) {},
});
