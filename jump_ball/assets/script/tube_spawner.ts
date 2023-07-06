import { Tube } from "./tube";
import {
	_decorator,
	Component,
	Node,
	Prefab,
	instantiate,
	v3,
	Quat,
	quat,
	Vec3,
	Material,
	MeshRenderer,
	log,
	game,
} from "cc";
import { Ball } from "./ball";
import { e, random } from "mathjs";
const { ccclass, property } = _decorator;

const temp_quat = quat();
@ccclass("TubeSpawner")
export class TubeSpawner extends Component {
	@property(Prefab)
	tubePrefab: Prefab | null = null!;

	_groupList: Node[] = [];
	_step = 0;
	depth=0;

	onLoad() {}

	start() {
		for (let i = 0; i < 10; i++) {
			const group = this.spawnGroup();	
		}
	}
	spawnGroup() {
		const node = new Node("group");
		for (let i = 0; i < 12; i++) {
			const tube = instantiate(this.tubePrefab);
			node.addChild(tube);
			
			Quat.fromEuler(temp_quat, -90, 30 * i, 0);
			tube.setRotation(temp_quat);
		}
		
		this.setBlock(node);
		if (this._step > 4) {
			this.setDefeated(node);
		}
		let p = node.position as Vec3;
		p.y = -this._step * 3.5;
		node.setPosition(p);

		this.node.addChild(node);
		this._groupList.push(node);
		this._step++;
		return node;
	}

	setBlock(target: Node) {
		let r = (Math.random() * target.children.length) | 0;
		let r2 = (r + 1) % target.children.length;

		target.children[r].active = false;
		target.children[r2].active = false;

		return r;
	}

	setDefeated(target: Node) {
		let r = (Math.random() * target.children.length) | 0;
		let r2 = (r + 1) % target.children.length;
		
		const tube = target.children[r];
		tube.getComponent(Tube).setDefeat();
		const tube2 = target.children[r2];
		tube2.getComponent(Tube).setDefeat();
		
	}

	update(deltaTime: number) {
		for (let i = 0; i < this._groupList.length; i++) {
			const element = this._groupList[i];
			if (element.position.y > Ball.instance.node.position.y - 0.5) {
				for (let child of element.children) {
					child.emit("break");
				}
				this._groupList.shift();
				this.spawnGroup();
				this.scheduleOnce(() => {
					element.destroy();
				}, 1);
				game.emit('add-score');
				this.depth++;
				return;
			}
		}
	}
}
