import { WATERMELON_ARRAY, Global_Date } from "../Global";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TouchEvent extends cc.Component {

	@property
	timer: number = 1;

	@property({ type: cc.Prefab, tooltip: "西瓜预制体" })
	watermelonPrefab: cc.Prefab = null

	@property(cc.Node)
	deathNode: cc.Node = null

	@property(cc.Node)
	guideLineNode:cc.Node=null;
	isCanDown: boolean;

	onLoad() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
		
		this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
		
		this.guideLineNode.active=false;
	}
	
	onDestroy() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
		
		this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
	}

	start() {
		this.isCanDown = true;
		this.node.emit('random-type')
	}
	
	onTouchStart(event: cc.Event.EventTouch){
		this.guideLineNode.active=true;
		let pos = this.node.convertToNodeSpaceAR(event.getLocation());
		this.guideLineNode.x=pos.x;
	}
	
	onTouchMove(event: cc.Event.EventTouch){
		let pos = this.node.convertToNodeSpaceAR(event.getLocation());
		this.guideLineNode.x=pos.x;
	}
	onTouchEnd(event: cc.Event.EventTouch){
		this.guideLineNode.active=false;
		let pos = this.node.convertToNodeSpaceAR(event.getLocation());
		this.watermelonDown(pos);
	}

	

	// update (dt) {}

	watermelonDown(pos: cc.Vec2) {
		if (!this.isCanDown) {
			return;
		}
		this.isCanDown = false;
		this.scheduleOnce(() => {
			this.isCanDown = true;
		}, this.timer);

		let watermelon = cc.instantiate(this.watermelonPrefab);
		watermelon.x = pos.x
		watermelon.y = this.deathNode.y - 200
		WATERMELON_ARRAY.push(watermelon)
		this.node.addChild(watermelon)

		this.node.emit('random-type')
	}
}
