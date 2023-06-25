
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    itemPrefab: cc.Prefab=null

    @property(cc.Node)
    scrollContent: cc.Node=null
    onLoad () {
        var infoData = JSON.parse(cc.sys.localStorage.getItem('score'));
        for (var i = 0; i < infoData.length; ++i) {    
            var item = cc.instantiate(this.itemPrefab);   
            var data = infoData[i];          
            this.scrollContent.addChild(item);
            item.getComponent('scoreItemTemplate').init({             
                score: data.score,
                time: data.time,           
            });
        }
    }

    backGame() {
        cc.director.loadScene('end');
    }

    start () {

    }

    // update (dt) {}
}
