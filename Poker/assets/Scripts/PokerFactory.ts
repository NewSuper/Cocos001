
import { _decorator, Component, Node, SpriteAtlas, Prefab, instantiate } from 'cc';
import { Poker } from './Poker';
const { ccclass, property } = _decorator;

// 加这个节点池; 
export class PokerFactory extends Component {
    public static Instance:PokerFactory = null!;

    private pokerAtlas: SpriteAtlas = null!;
    private pokerPrefab: Prefab = null!;
    

    public Init(pokerAtlas: SpriteAtlas, pokerView: Prefab): void {
        PokerFactory.Instance = this;

        this.pokerAtlas = pokerAtlas;
        this.pokerPrefab = pokerView;
    }

    private valueToName(pokerValue): string {
        var pokerTypes = ['d', 'c', 'h', 's'];
        var pokerType = Math.floor(pokerValue / 100);
        pokerValue = pokerValue % 100;

        return pokerTypes[pokerType - 1] + pokerValue;
    }

    public CreatePoker(pokerValue: number): Poker {
        var poker = instantiate(this.pokerPrefab);
        this.node.addChild(poker);

        var pokerCtrl = poker.addComponent(Poker);

        var bgSp = this.pokerAtlas.getSpriteFrame("pkbm");

        var pokerName = this.valueToName(pokerValue);
        var valueSp = this.pokerAtlas.getSpriteFrame(pokerName);
        pokerCtrl.Init(pokerValue, bgSp, valueSp);

        return pokerCtrl;
    }
}


