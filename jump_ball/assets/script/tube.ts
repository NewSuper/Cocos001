import {
	_decorator,
	Component,
	Node,
	RigidBody,
	ERigidBodyType,
	MeshRenderer,
	Material,
	MeshCollider,
	Vec3,
	Quat,
	v3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Tube")
export class Tube extends Component {
	@property(Material)
	material: Material = null;

	isBreak:boolean=false;

    isDefeat:boolean=false

	onLoad() {
		this.node.on("break", this.break, this);
	}

	//破坏
	break() {
		if(this.isBreak){
			return;
		}
		this.isBreak=true;
		let rigidBody = this.node.getComponent(RigidBody);
		rigidBody.type = ERigidBodyType.DYNAMIC;
		const force=v3();
		Vec3.scaleAndAdd(force,Vec3.UNIT_Z,Vec3.ONE,8)
		Vec3.transformQuat(force,force,this.node.rotation);
		rigidBody.setLinearVelocity(force);
		let meshCollider=this.node.getComponent(MeshCollider);
		meshCollider.destroy();
	}

	//结束游戏方块
	setDefeat() {
        this.isDefeat=true;
		const Tube = this.node.getChildByName("Tube");
		let mesh = Tube.getComponent(MeshRenderer);
		mesh.material=this.material;
	}
}
