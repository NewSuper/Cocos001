import { _decorator, Component, Label } from 'cc';
import { UIMgr } from './Lib/UIMgr';
const { ccclass, property } = _decorator;

declare global {
    interface LoseUI_UIData {
        closeHandler: () => void;
        score: number;
    }
}

@ccclass('LoseUI')
export class LoseUI extends Component implements IUI<LoseUI_UIData> {
    static readonly CLASS_NAME: string = "LoseUI";
    static readonly prefabUrl: string = "LoseUI";
    static readonly bundleName: string = "PrefabBundle";

    @property({ type: Label, displayName: "分数" }) private scoreLabel: Label = null!;

    private uiData: LoseUI_UIData;

    OnOpen(uiData?: LoseUI_UIData) {
        this.uiData = uiData;
        this.scoreLabel.string = `分数：${uiData.score}`
    }

    clickToClose() {
        this.uiData.closeHandler();
        UIMgr.getInstance().close(this);
    }
}

