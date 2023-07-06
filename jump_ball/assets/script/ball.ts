import { Tube } from "./tube";
import {
	_decorator,
	Component,
	Node,
	SphereCollider,
	ICollisionEvent,
	RigidBody,
	game,
	v3,
	Collider,
	instantiate,
	Prefab,
	quat,
	Quat,
	Vec3,
	AnimationComponent,
} from "cc";

const { ccclass, property } = _decorator;

const temp_pos = v3();
@ccclass("Ball")
export class Ball extends Component {
	@property(Prefab)
	picPrefab: Prefab = null;
	
	@property
	initSpeed: number = 6;

	@property
	height: number = 4;

	@property(Node)
	camera: Node = null!;

	

	private static _instance: Ball=null;
	public static get instance(){
		return Ball._instance;
	};

	onLoad() {
		Ball._instance = this;
	}

	start() {
		let collider = this.getComponent(SphereCollider);
		collider.on("onCollisionEnter", this.onCollisionEnter, this);
	}

	onCollisionEnter(event: ICollisionEvent) {
		let other = event.otherCollider.node.getComponent(Tube);
		//游戏结束
		if (other.isDefeat) {
			game.emit("game-over");
			let rigidBody = this.node.getComponent(RigidBody);
			rigidBody.destroy();
			let collider = this.node.getComponent(Collider);
			collider.off("onCollisionEnter");
			collider.destroy();
			return;
		}
		this.bounce();
		this.node.emit("collision");
		this.spawnPic(event.otherCollider.node.parent.parent);
	}

	update() {
		if (this.camera) {
			temp_pos.set(this.camera.position);
			if (temp_pos.y > this.node.position.y + this.height) {
				temp_pos.y = this.node.position.y + this.height;
				this.camera.setPosition(temp_pos);
			}
		}
	}

	//反弹
	bounce() {
		let rigid = this.node.getComponent(RigidBody);
		rigid?.setLinearVelocity(v3(0, this.initSpeed, 0));
		game.emit("reset-score");
	}

	spawnPic(other:Node) {
		
		const pic = instantiate(this.picPrefab);
		let pos=this.node.getPosition() as Vec3;
		const temp=v3();
		const quatTemp=quat();
		other.getRotation().getEulerAngles(temp);
		temp.y=-temp.y;
		Quat.fromEuler(quatTemp,temp.x,temp.y,temp.z);
		Vec3.transformQuat(pos,pos,quatTemp);
		pic.setPosition(pos);
		other.addChild(pic);
		pic.getComponent(AnimationComponent).play();
		return pic;
	  }
}
