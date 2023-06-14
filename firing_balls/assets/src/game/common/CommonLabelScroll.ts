import { Tween } from "../../common/tween/Tween";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonLabelScroll extends cc.Component {
    @property(cc.Label)
    lb_num: cc.Label = null;

    private _num = { value: 0 };

    onEnable() {
        if (!this.lb_num) {
            this.lb_num = this.node.getComponent(cc.Label);
        }
        this.initValue(this._num.value);
    }

    initValue(value: number) {
        this._num.value = value;
        if (this.lb_num)
            this.lb_num.string = `${Math.ceil(this._num.value)}`;
    }

    updateValue(newValue: number, oldValue?: number) {
        if (oldValue != void 0) {
            this.initValue(oldValue);
        }
        if (!this.lb_num) {
            this._num.value = newValue;
            return;
        }

        Tween.removeTweens(this._num)
        if (newValue < this._num.value) {
            if (newValue == this._num.value) {
                this._num.value = newValue;
                this.lb_num.string = `${newValue}`;
            } else {
                Tween.get(this._num, {
                    onChange: () => {
                        this.lb_num.string = `${Math.ceil(this._num.value)}`;
                    }
                }).to({ value: newValue }, 1500);
            }
        } else {
            const offset_num = newValue - this._num.value;
            Tween.get(this._num, {
                onChange: () => {
                    this.lb_num.string = `${Math.ceil(this._num.value)}`;
                }
            }).to({ value: newValue }, 300 + (offset_num > 10 ? 700 : 0) + (offset_num > 100 ? 500 : 0) + (offset_num > 1000 ? 500 : 0));
        }
    }

    onDisable() {
        Tween.removeTweens(this._num);
    }
}