import { Data } from "../model/Data";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.Prefab])
    platformPrefab: cc.Prefab[] = [];

    @property([cc.Prefab])
    glodPrefab: cc.Prefab[] = [];
    
    @property(cc.Node)
    glodLayer:cc.Node=null

    @property(cc.Node)
    lastPlatform: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Data.speed=400;
        this.node.on('spawnPlatform',this.spawnPlatform,this);
    }

    start() {
        for (let i = 0; i < 10; i++) {
            this.spawnPlatform();
            
        }
    }

   

    spawnPlatform() {
        let index = this.randomRange(0, this.platformPrefab.length) | 0;
        let platform = cc.instantiate(this.platformPrefab[index]);
        cc.log('平台数  '+this.node.childrenCount)
        let v3 = cc.v3();
        if (this.lastPlatform == null) {
            return;
        }
        //下一个平台的位置
        let right = this.lastPlatform.getBoundingBox();
        v3.x = right.xMax + platform.width / 2 + this.randomRange(120, 250);
        let height = cc.winSize.height;
        v3.y = this.randomRange(height * 0.5, height * 0.6) - height / 2;
        //防止太高,跳不上去
        let offer_y = 80;
        if (v3.y > this.lastPlatform.y + offer_y) {
            v3.y = this.lastPlatform.y + offer_y;
        }
        platform.position = v3;
        platform.parent = this.node;
        this.lastPlatform = platform;

        this.spawnGlod();
    }

    spawnGlod(){
        if(Math.random()<0.5){
            return;
        }

        let i=this.randomRange(0,this.glodPrefab.length) | 0;
        let glod_group=cc.instantiate(this.glodPrefab[i]);
        let glodList:cc.Node[]=[]
        let pos=this.lastPlatform.position;
        for(let glod of glod_group.children){  
            glodList.push(glod);
        }
        for(let glod of glodList){
            glod.removeFromParent(false);
            this.glodLayer.addChild(glod);
            cc.log('金币数 '+this.glodLayer.childrenCount)
            glod.x+=pos.x;
            glod.y+=pos.y+100;
            glod.addComponent('glod');
        }
       
    }

    randomRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }


}
