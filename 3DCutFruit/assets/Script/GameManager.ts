import { Prefab, instantiate, v3 } from 'cc';
import { TextAsset } from 'cc';
import { _decorator, assetManager, Component, Node, AssetManager, Asset } from 'cc';
import { ExcelMgr } from './ExcelMgr';
import { FruitItem } from './FruitItem';
const { ccclass, property } = _decorator;

enum GameState{
    Ready = 1,
    Running= 2,
    CheckOut = 3
}

@ccclass('GameManager')
export class GameManager extends Component {
    private excelBundle: AssetManager.Bundle = null;
    private fruitPrefabBundle: AssetManager.Bundle = null;

    private difficulty:number = 1;//游戏的难度，然后不断递增
    private fragments:Array<any> = null;//我们当前难度的等级
    private fragIndex:number = 0;//当前我们操作的索引
    private allFragments:Array<any> = null;//所有我们的包含难度的操作

    private passedTime:number=0;//生成水果过去的时间
    private nextTime:number = 0;//下一次生成水果的时间
    private gameState:GameState = GameState.Ready;
    
    private fruitRoot:Node = null;//父亲节点
    private spawnLine:number = 0;//水果出生的线  y

    private async loadBundle(name: string): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(name, (err, bundle) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(bundle);
                }
            });
        });
    }

    private async loadDir(
        bundle: AssetManager.Bundle,
        dir: string,
        assetType: typeof Asset
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            bundle.loadDir(dir, assetType, (err, assets) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private async preloadBundle(): Promise<void> {
        try {
            this.excelBundle = await this.loadBundle('Datas');
            this.fruitPrefabBundle = await this.loadBundle('FruitModels');
            await this.loadDir(this.excelBundle, './', TextAsset);
            await this.loadDir(this.fruitPrefabBundle, './', Prefab);
            this.startGame();
        } catch (error) {
            console.error('Failed to load bundles or directories.', error);
        }
    }

     
    //获取难度等级
    private getFragmentByDifficulty(difficulty:number):Array<any>{
        var fragments =[];
        for(var i=0;i<this.allFragments.length;i++){
            if(this.allFragments[i].difficulty == difficulty ){  
               fragments.push(this.allFragments[i]);
            }
        }
        return fragments;
    }

    private startGame(): void {
        (window as any).test = this;

        console.warn("ExcelMgr.Instance:",ExcelMgr.Instance);
        ExcelMgr.Instance.addTable("fragment",(this.excelBundle.get("fragment") as TextAsset).text)
        ExcelMgr.Instance.addTable("fruit",(this.excelBundle.get("fruit") as TextAsset).text)
    
        let res=ExcelMgr.Instance.queryByID("fruit","1001");
        console.warn("res:",res);

        this.allFragments  = ExcelMgr.Instance.getTableArr("fragment");
        console.warn("allFragment:",this.allFragments);
        this.gameState = GameState.Ready;

        this.resetGame();
    }

    //重置游戏
    private resetGame():void{
        this.fruitRoot.removeAllChildren();//每次重新开始得，清理

        this.difficulty = 1;
        this.fragments = this.getFragmentByDifficulty(this.difficulty);
        
        if(this.fragments.length <=-10){
            console.log("error check data");
            return;
        }
        this.fragIndex = 0;//从当前难度的第一个开始

        this.gameState  = GameState.Running;

        this.genOneFruit();
    }

    private initScale:number =0;
    private genFruitNodeWithConfig(fragConfig:any){
       //根据fragConfig ---找出是哪个水果。如果是-1 就随机生成1个
       var fruitId = fragConfig.fruitId;
       var fruitConfig = null;
       if(fruitId == -1){
          var fruitConfigs = ExcelMgr.Instance.getTableArr("fruit");
          var totalCount = fruitConfigs.length;  
          var randomIndex = Math.floor(Math.random() * totalCount); 
          fruitConfig = fruitConfigs[randomIndex];
       }else{
        fruitConfig = ExcelMgr.Instance.queryByID("fruit",fruitId);
       }
       console.log("产生了一个水果----",fruitConfig);
       if(fragConfig === null){
          console.log("error check data  126");
          return;
       }
       var fruitPrefab:Prefab = this.fruitPrefabBundle.get(fruitConfig.prefab);
       var fruitNode = instantiate(fruitPrefab);
       this.fruitRoot.addChild(fruitNode);

       //设置节点位置
       var per: number = parseFloat(fragConfig.positionX) / 1280;
       var totalLen = 18;
       var x_pos = -totalLen * 0.5 + totalLen * per;
       var y_pos = this.spawnLine;//水果出生时的高度
       var z_pos = -10;//距离摄像机的距离，你摆一个合适的大小即可

       fruitNode.setPosition(v3(x_pos,y_pos,z_pos));
       //调整大小缩放
       
       //实例化水果脚本控制逻辑
      var fruitItem:FruitItem =  fruitNode.addComponent(FruitItem);
      fruitItem.initFruit(fruitConfig);
      var fx = parseFloat(fruitConfig.forceX);
      var fy = parseFloat(fruitConfig.forceY);
      fruitItem.throwFruitOut(v3(fx,fy,0));
    }
    
    //产生一个水果
    private genOneFruit():void{
        var fragConfig:any= this.fragments[this.fragIndex];

        //根据配置产生水果节点
        this.genFruitNodeWithConfig(fragConfig);

        //进入下1个的计时
        this.passedTime = 0;
        this.nextTime = parseFloat(fragConfig.time);
        
        this.fragIndex++;
        //代表当前难度跑完了
        if(this.fragIndex >= this.fragments.length){

           this.difficulty ++;
           var fragment = this.getFragmentByDifficulty(this.difficulty);
           if(fragment.length < 0){
               this.difficulty --;
           }else{
               this.fragments = fragment;
           } 
           this.fragIndex = 0;
        }
    }

    start() {
        this.fruitRoot = this.node.getChildByName("fruitRoot");
        this.node.addComponent(ExcelMgr)
        this.preloadBundle();
    }

    update(deltaTime: number) {
        this.genFruitUpdate(deltaTime);
    }

    genFruitUpdate(deltaTime: number){
      if(this.gameState !== GameState.Running){
        return;
      }
      this.passedTime += deltaTime;
      if(this.passedTime >= this.nextTime){
        this.passedTime = 0;
        this.genOneFruit();
      }
    }
}
