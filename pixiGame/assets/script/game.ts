const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Node)
    enemyNode: cc.Node = null;

    @property(cc.ParticleSystem)
    boomPartice: cc.ParticleSystem = null;

    @property(cc.Label)
    label: cc.Label = null;

    isFire:boolean;
    score:number=0;

    onLoad () {
        this.placePlayer();
        this.placeEnemy();
    }

    start () {
        this.node.on('touchstart',this.fire,this);
    }

    onDestroy(){
        this.node.off('touchstart',this.fire,this);
    }

    update (dt) {
        let down=dt*100;

        this.playerNode.y-=down;

        if(this.playerNode.active&&this.playerNode.y<=-600){
            this.gameover();
        }

        if(this.playerNode.getBoundingBox().intersects(this.enemyNode.getBoundingBox())){
           this.hitTarget();
        }
    }

    placePlayer(){
        this.playerNode.active=true;
        this.playerNode.stopAllActions();
        this.isFire=false;
        this.playerNode.y=-cc.winSize.height/4;
    }

    placeEnemy(){
        this.enemyNode.active=true;
        this.enemyNode.stopAllActions();
        let x=cc.winSize.width/2-this.enemyNode.width/2;
        let y=Math.random()*cc.winSize.height/4;
        let duartion=0.6+Math.random();

        this.enemyNode.x=0;
        this.enemyNode.y=cc.winSize.height/2-cc.winSize.height/3;

        let action=cc.tween(this.enemyNode)
        .to(duartion,{position:cc.v3(-x,y)})
        .to(duartion,{position:cc.v3(x,y)});

        cc.tween(this.enemyNode).repeatForever(action)
        .start();
    }

    //发射
    fire(){
        if(this.isFire)
            return;
        
        this.isFire=true;
        let duration=0.6;      
        cc.tween(this.playerNode)
            .to(duration,{position:cc.v3(0,cc.winSize.height/2)})
            .call(()=>{this.gameover()})
            .start()
    }

    gameover(){
        this.playerNode.active=false; 
        this.boom(this.playerNode.position,this.playerNode.color);
        this.schedule(()=>cc.director.loadScene('main'),1)
    }

    hitTarget(){
        this.enemyNode.active=false; 
        this.playerNode.active=false; 
        this.boom(this.enemyNode.position,this.enemyNode.color);
        this.score++;
        this.label.string=this.score.toString();
        this.placeEnemy();
        this.placePlayer();
    }

    boom(v3:cc.Vec3,color:cc.Color){
        this.boomPartice.resetSystem();
        this.boomPartice.enabled=true;
        this.boomPartice.node.position=v3;
        this.boomPartice.endColor=color;
        this.boomPartice.node.active=true;
        
    }
}
