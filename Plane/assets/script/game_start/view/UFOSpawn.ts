import { ItemType } from "../type/ItemTypeState";

const { ccclass, property } = cc._decorator;



cc.Enum(ItemType)


@ccclass
export default class UFOITem extends cc.Component {

	@property(cc.Prefab)
	ufoPrefab: cc.Prefab = null

	@property({
		type: ItemType
	})
	type: ItemType = ItemType.bomb;



	@property
	maxDelay: number = 30;
	@property
	minDelay: number = 10;

	onLoad() {
		this.node.on('collision', this.spawnNewUfo, this);
	}

	randNewUfo() {
		let ufo = cc.instantiate(this.ufoPrefab);
		this.node.addChild(ufo);

		ufo.y = 480;
		ufo.x = (Math.random() - 0.5) * cc.winSize.width;
		
		// let type=Math.random() * Object(ItemType)
	}

	spawnNewUfo() {
		let delay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
		this.scheduleOnce(this.randNewUfo, delay);
	}

	start() {
		this.spawnNewUfo();
	}

	onCollisionEnter(other: cc.Collider, self: cc.Collider) {
		if (other.node.group == 'hero') {
			this.spawnNewUfo();
			this.node.removeAllChildren();
		}
	}

}

