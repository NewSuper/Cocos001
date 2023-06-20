import { Global_Date } from "../Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLogic extends cc.Component {
	
	
	@property({ type: cc.SpriteAtlas, tooltip: "西瓜图片" })
	spriteAtlas: cc.SpriteAtlas = null
	
    @property(cc.Node)
	typeNode: cc.Node = null

	onLoad() {
	
		this.node.on('random-type',this.randomType,this);
	}
	//转换图片
	randomType() {
		// random range
		let randomNum = Math.floor(Math.random() * 4) | 0
		let sprite = this.typeNode.getComponent(cc.Sprite)
		sprite.spriteFrame = this.spriteAtlas.getSpriteFrames()[randomNum]
		Global_Date.fruitType = randomNum
	}
}