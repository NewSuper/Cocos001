
import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';

export class Poker extends Component {
    private value: number = 0;
    private backSp: SpriteFrame = null!;
    private valueSp: SpriteFrame = null;
    private sprite: Sprite = null!;

    public Init(value: number, backSp: SpriteFrame, valueSp: SpriteFrame): void {
        this.value = value;
        this.backSp = backSp;
        this.valueSp = valueSp;
        this.sprite = this.node.getComponent(Sprite);

        // this.ShowBackground();
        // this.ShowValue();
    }

    public ShowBackground(): void {
        this.sprite.spriteFrame = this.backSp;
    }

    public ShowValue(): void {
        this.sprite.spriteFrame = this.valueSp;
    }

    public PokerValue(): number {
        return this.value;
    }
}

