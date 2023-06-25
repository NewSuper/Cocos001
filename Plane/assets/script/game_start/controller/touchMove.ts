const {ccclass, property} = cc._decorator;

@ccclass
export default class MyTouchMove extends cc.Component {

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    player:cc.Node=null;

    private _isCanMove=false;

    onLoad () {
        
    }

    start () {
        this.background.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.background.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
    }

    onTouchStart(e:cc.Event.EventTouch){
        this._isCanMove=true;
    }

    onTouchMove(e:cc.Event.EventTouch){
        if(cc.director.isPaused()){
            return
        }
        let v2=e.getDelta();      
        if(this._isCanMove&&this.node){
            //cc.log(v2.x+" "+v2.y)
            this.node.x+=v2.x
            this.node.y+=v2.y
        }
       
    }

    onTouchEnd(e:cc.Event.EventTouch){
        this._isCanMove=false;
    }

    // update (dt) {}
}
