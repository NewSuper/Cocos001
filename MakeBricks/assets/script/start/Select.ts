//import {settings} from './Settings';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    levelPrefab: cc.Prefab = null;
    @property(cc.Node)
    levelsLayout: cc.Node = null;

    @property(cc.JsonAsset)
    setJson:cc.JsonAsset=null

    onLoad () {
      
    }

    start() {
        this.initLevels();
    }

    // update (dt) {}

    initLevels () {
        let item=cc.sys.localStorage.getItem('level_setting')
        if (item==null) {
            let settings:LevelType[]=this.setJson.json;
            cc.log(settings);
            for (let i=0; i<settings.length; i++) {
               let level = cc.instantiate(this.levelPrefab);
                //level.attr = settings[i];
                for(let v of Object.keys(settings[i])){
                    level.attr[v]=settings[v];
                    cc.log(v+' '+ settings[v])
                }
                level.getComponent('Level').changePic(settings[i]['levelState'], i+1);
                this.levelsLayout.addChild(level);
            }
            // 将所有关卡信息存入本地(针对首次游戏)
            cc.sys.localStorage.setItem('level_setting', JSON.stringify(settings));
        }
        else {
            // 如果玩家已经玩过，则从本地存储中获取关卡配置信息
            let newSettings:LevelType[] = JSON.parse(item);
            for (let i=0; i<newSettings.length; i++) {
                let level = cc.instantiate(this.levelPrefab);
                // level.settings = newSettings[i];
                for(let v of Object.keys(newSettings[i])){
                     level.attr[v]=newSettings[v];
                    cc.log(v+' '+ newSettings[v])
                }
                level.getComponent('Level').changePic(newSettings[i]['levelState'], (i+1).toString());
                this.levelsLayout.addChild(level);
            }
        }
    }
}
