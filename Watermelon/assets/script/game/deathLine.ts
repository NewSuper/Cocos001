const { ccclass, property } = cc._decorator;

@ccclass
export default class DeathLine extends cc.Component {

	@property(cc.Node)
	deathNode: cc.Node = null

	//撞到后游戏结束
	onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
		if (other.node.group == "default") {
			// this.background.off(cc.Node.EventType.TOUCH_START);
			cc.game.emit('game-over');
			this.deathNode.active = true;
		}
	}

	// update (dt) {}
}
