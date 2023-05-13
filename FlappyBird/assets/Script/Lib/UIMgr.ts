import { _decorator, assetManager, Component, Constructor, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

declare global {
    type UIClass<T extends (Component & IUI<UIDATA>), UIDATA> = Constructor<T> & {
        readonly prefabUrl: string,
        readonly bundleName: string,
        readonly CLASS_NAME: string,
    }

    interface IUI<UIDATA> {
        OnOpen(uiData?: UIDATA): void;
    }
}

@ccclass('UIMgr')
export class UIMgr extends Component {
    private static _instance: UIMgr = null!;

    static getInstance(): UIMgr {
        return this._instance;
    }

    onLoad() {
        UIMgr._instance = this;
    }

    /**
     * UI 管理器
     * @param uiClass 
     * @param uiData 
     */
    open<UIDATA = any, T extends (Component & IUI<UIDATA>) = any>(uiClass: UIClass<T, UIDATA>, uiData?: UIDATA) {
        assetManager.loadBundle(uiClass.bundleName, (_, bundle) => {
            bundle.load(uiClass.prefabUrl, Prefab, (err, prefab) => {
                if (err) {
                    console.error(err);
                    return;
                }
                const uiNode = instantiate(prefab);
                this.node.addChild(uiNode);
                const uiComponent = uiNode.getComponent(uiClass.CLASS_NAME) as any as IUI<UIDATA>;
                uiComponent.OnOpen(uiData)
            })
        })
    }

    close<T extends (Component & IUI<any>) = any>(uiComponent: T) {
        uiComponent.node.destroy();
    }
}

