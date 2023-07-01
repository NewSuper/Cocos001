
import { _decorator, Component, Node, Prefab, assetManager, Asset, AssetManager, SpriteAtlas } from 'cc';
import { PokerFactory } from './PokerFactory';
const { ccclass, property } = _decorator;

 
@ccclass('GameApp')
export class GameApp extends Component {

    private gameBundle: AssetManager.Bundle = null!;
    private pokerAltas: SpriteAtlas = null!;
    private pokerViewPrefab: Prefab = null!;

    public onLoad(): void {
        // 初始化入口
        assetManager.loadBundle("Game", (err, bundle: AssetManager.Bundle)=>{
            this.gameBundle = bundle;
            this.onLoadPokerAtlas();
        });
        // end
    }

    private onLoadPokerAtlas(): void {
        this.gameBundle.load("poker", SpriteAtlas, (err, atlas: SpriteAtlas)=>{
            this.pokerAltas = atlas;
            this.onLoadPokerPrefab();
        });
    }

    private onLoadPokerPrefab(): void {
        this.gameBundle.load("PokerView", Prefab, (err, prefab: Prefab)=>{
            this.pokerViewPrefab = prefab;
            this.EnterGame();
        });
    }

    private EnterGame(): void {
        this.node.addComponent(PokerFactory).Init(this.pokerAltas, this.pokerViewPrefab);
        var pokers = [112, 104, 105, 106, 
                      213, 204, 205, 206, 
                      303, 314, 305, 306, 
                      413, 404, 405, 406];
        
        pokers.sort((lhs: number, rhs: number): number=>{
            if(Math.random() < 0.5) {
                return -1; // lhs 排在rhs 前面;
            }
            return 1; // lhs 排在rhs后面;
        });

        pokers.sort((lhs: number, rhs: number): number=>{
            if(Math.random() < 0.5) {
                return -1; // lhs 排在rhs 前面;
            }
            return 1; // lhs 排在rhs后面;
        });
        
        var xpos = -400;
        var ypos = 0;

        for(var i = 0; i < pokers.length; i ++) {
            var poker = PokerFactory.Instance.CreatePoker(pokers[i]);
            poker.ShowValue();
            poker.node.setPosition(xpos, ypos);
            xpos += 48;
        }
        
    }
}

