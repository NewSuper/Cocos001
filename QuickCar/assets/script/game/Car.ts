import { _decorator, Component, Node, Vec3, ParticleSystem, BoxCollider, RigidBody, ICollisionEvent } from "cc";
import { RoadPoint } from "./RoadPoint";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
import { AudioManager } from "./AudioManager";
import { RunTimeData } from "../data/GameData";
const { ccclass, property } = _decorator;

//尽量不要在update 中new 一个对象，因为js 回收机制没法由我们控制。//通过外部设置一个临时变量来复用（因为不知道怎么才算到站了）
const _tempVec = new Vec3(); 
const EventName = Constants.EventName;
const TOOTING_COOL_TIME = 5;//冷却时间5s

enum RunState {
    NORMAL = 0,
    INORDER = 1,
    CRASH = 2,
    OVER = 3,
}
/**
 * 1.小车的开始位置摆放
 * 2.小车的运动，匀速从开始到结束
 * 3.小车拐弯
 * 4.小车匀加速和刹车
 */
@ccclass("Car")
export class Car extends Component {
    @property
    maxSpeed = 0.2;
    @property
    minSpeed = 0.02;

    private _currRoadPoint: RoadPoint | null = null;
    private _pointA = new Vec3();
    private _pointB = new Vec3();
    private _currSpeed = 0;//当前速度
    private _isMoving = false;
    private _offset = new Vec3();//快捷读取世界坐标，但不能修改
    private _originRotation = 0;//初始旋转点
    private _currRotation = 0;
    private _targetRotation = 0;
    private _centerPoint = new Vec3();
    private _rotMeasure = 0;//弧度
    private _acceleration = 0.2;//加速度
    private _isMain = false;
    private _isBraking = false;
    private _gas: ParticleSystem | null = null;//管理尾气
    private _overCD: Function | null = null;//标记小车运行结束，准备要回收
    private _camera: Node | null = null;
    private _tootingCoolTime = 0;
    private _minSpeed = 0;
    private _maxSpeed = 0;
    private _runState = RunState.NORMAL;

    public start(){
        CustomEventListener.on(EventName.FINISHED_WALK, this._finishedWalk, this);

        this._minSpeed = this.minSpeed;
        this._maxSpeed = this.maxSpeed;
    }

    public update(dt: number){
        this._tootingCoolTime = this._tootingCoolTime > dt ? this._tootingCoolTime - dt : 0;//赋值冷却时间
        //没移动，订单中，撞车，就不行驶
        if ((!this._isMoving && this._currSpeed <= 0) 
           || this._runState === RunState.INORDER 
           || this._runState === RunState.CRASH) {
            return;
        }

        this._offset.set(this.node.worldPosition);//先保存1份_offset

        this._currSpeed += this._acceleration * dt;
        if (this._currSpeed > this._maxSpeed) {
            this._currSpeed = this._maxSpeed;//限速的处理
        }

        if (this._currSpeed <= 0.001) {//刹车到几乎要停止的状态
            this._currSpeed = this.minSpeed;
            if (this._isBraking) {
                this._isBraking = false;
                CustomEventListener.dispatchEvent(EventName.END_BRAKING);
            }
        }

        switch (this._currRoadPoint!.moveType) {
            case RoadPoint.RoadMoveType.BEND:
                const offsetRotation = this._targetRotation - this._originRotation;//得出需要旋转的角度
				                        //当前旋转值  -   起始旋转值
                let nextStation = (this._currRotation - this._originRotation)
				    //当前速度  * 弧度值 得出这一帧要旋转的角度是多少
				+ (this._currSpeed * this._rotMeasure * (this._targetRotation > this._originRotation ? 1 : -1));
                if (Math.abs(nextStation) > Math.abs(offsetRotation)) {
                    nextStation = offsetRotation;
                }

                const target = this._currRotation = nextStation + this._originRotation;
                _tempVec.set(0, target, 0);
                this.node.eulerAngles = _tempVec;
				    // const sin = Math.sin(nextStation * Math.PI / 180);
                    // const cos = Math.cos(nextStation * Math.PI / 180);
                    // const xLength = this._pointA.x - this._centerPoint.x;
                    // const zLength = this._pointA.z - this._centerPoint.z;
                    // const xPos = xLength * cos + zLength * sin + this._centerPoint.x;
                    // const zX = -xLength * sin + zLength * cos + this._centerPoint.z;
                    // this._offset.set(xPos,0,zX)  //此为复杂的写法,下为系统api简单用法
				
                Vec3.rotateY(this._offset, this._pointA, this._centerPoint, nextStation * Math.PI / 180);
                break;
            default://默认走直线，匀速
                const z = this._pointB.z - this._pointA.z;
                if (z !== 0) {
                    if (z > 0) {//z 大于0 是沿z轴的正方向
                        this._offset.z += this._currSpeed;
						   //假设当前我们要靠近目标点，刚好穿过去的话，就做个容错处理
                        if (this._offset.z > this._pointB.z) {
                            this._offset.z = this._pointB.z;
                        }
                    } else {
                        this._offset.z -= this._currSpeed;
                        if (this._offset.z < this._pointB.z) {
                            this._offset.z = this._pointB.z;
                        }
                    }
                } else {
                    const x = this._pointB.x - this._pointA.x;
                    if (x > 0) {
                        this._offset.x += this._currSpeed;
                        if (this._offset.x > this._pointB.x) {
                            this._offset.x = this._pointB.x;
                        }
                    } else {
                        this._offset.x -= this._currSpeed;
                        if (this._offset.x < this._pointB.x) {
                            this._offset.x = this._pointB.x;
                        }
                    }
                }
                break;
        }

        this.node.setWorldPosition(this._offset);
        Vec3.subtract(_tempVec, this._pointB, this._offset);
        if (Math.floor(_tempVec.length() * 100) / 100 <= 0.01) {
            this._arrivalStation();
        }
    }

    public setEntry(entry: Node, isMain = false){
        this.node.setWorldPosition(entry.worldPosition);
        this._currRoadPoint = entry.getComponent(RoadPoint)!;
        this._isMain = isMain;
        if(!this._currRoadPoint){
            console.warn('There is no RoadPoint in ' + entry.name);
            return;
        }

        this._pointA.set(entry.worldPosition);
        this._pointB.set(this._currRoadPoint.nextStation.worldPosition);

        const z = this._pointB.z - this._pointA.z;
        if (z !== 0) {
            if (z < 0) {
                this.node.eulerAngles = new Vec3();
            } else {
                this.node.eulerAngles = new Vec3(0, 180, 0);
            }
        } else { //z 方向若不存在偏移。那就是x轴偏移了
            const x = this._pointB.x - this._pointA.x;
            if (x > 0) {
                this.node.eulerAngles = new Vec3(0, 270, 0);//也可设置为-90  写成270是为了统一方向
            } else {
                this.node.eulerAngles = new Vec3(0, 90, 0);
            }
        }

        this._originRotation = this._targetRotation = this._currRotation = this.node.eulerAngles.y;
        this._runState = RunState.NORMAL;
        this._currSpeed = 0;
        this._isMoving = false;
        const collider = this.node.getComponent(BoxCollider)!;//获取碰撞组件
        if (this._isMain) {
            const gasNode = this.node.getChildByName('gas')!;
            this._gas = gasNode.getComponent(ParticleSystem); //只有玩家小车需要管理尾气，AI 小车不需要
            this._gas!.play();

            collider.on('onCollisionEnter', this._onCollisionEnter, this);//碰撞事件监听
            // collider.setGroup(Constants.CarGroup.MAIN_CAR); //碰撞分组
            // collider.setMask(Constants.CarGroup.OTHER_CAR);
        } else {
            // collider.setGroup(Constants.CarGroup.OTHER_CAR);
            // collider.setMask(-1); //所有组都不检测的掩码就是0  ，-1 代表都检测 （Ai car 都检测）
        }

        this._resetPhysical();
    }

    public setCamera(camera: Node, pos: Vec3, rotation: number){
        if(this._isMain){
            this._camera = camera;
            this._camera.parent = this.node;
            this._camera.setPosition(pos);
            this._camera.eulerAngles = new Vec3(rotation, 0, 0);
        }
    }

    public startRunning() {
        if(this._runState !== RunState.NORMAL){
            return;
        }

        this._minSpeed = this.minSpeed;
        this._maxSpeed = this.maxSpeed;
        if (this._currRoadPoint) {
            this._isMoving = true;
            this._acceleration = 0.2;
        }
        //判断刹车拖尾是否消失
        if(this._isBraking){
            CustomEventListener.dispatchEvent(EventName.END_BRAKING);
            this._isBraking = false;
        }
    }

    public stopRunning() {
        if (this._runState !== RunState.NORMAL) {
            return;
        }

        this._acceleration = -0.3;
        CustomEventListener.dispatchEvent(EventName.START_BRAKING, this.node);//执行刹车
        this._isBraking = true;
        AudioManager.playSound(Constants.AudioSource.STOP);
        // this._isMoving = false;
    }

    public moveAfterFinished(cd: Function){
        this._overCD = cd;
    }

    public stopImmediately() {
        this._isMoving = false;
        this._currSpeed = 0;
    }

    public tooting(){
        if(this._tootingCoolTime > 0){
            return;
        }

        this._tootingCoolTime = TOOTING_COOL_TIME;
        const audioSource = Math.floor(Math.random() * 2) < 1?Constants.AudioSource.TOOTING1: Constants.AudioSource.TOOTING2;
        AudioManager.playSound(audioSource);
    }

    public startWithMinSpeed(){
        this._currSpeed = this.minSpeed;//最小速度行驶
        this._maxSpeed = this._minSpeed;//若没操作的情况下，让其保持匀速状态
        this._isMoving = true;
    }

    private _arrivalStation(){
        this._pointA.set(this._pointB);
        this._currRoadPoint = this._currRoadPoint!.nextStation.getComponent(RoadPoint);
        if (this._currRoadPoint!.nextStation) {
            this._pointB.set(this._currRoadPoint!.nextStation.worldPosition);
            this._originRotation = this._targetRotation;

            if (this._isMain) {
                if (this._isBraking) {
                    this._isBraking = false;
                    CustomEventListener.dispatchEvent(EventName.END_BRAKING);
                }

                if (this._currRoadPoint!.type === RoadPoint.RoadPointType.GREETING) {
                    this._greetingCustomer();
                } else if (this._currRoadPoint!.type === RoadPoint.RoadPointType.GOODBYE) {
                    this._takingCustomer();
                } else if (this._currRoadPoint!.type === RoadPoint.RoadPointType.END) {
                    AudioManager.playSound(Constants.AudioSource.WIN);
                    this._runState = RunState.OVER;
                    this._minSpeed = this._maxSpeed = 0.2;
                    this._currSpeed = this._minSpeed;
                    this._acceleration = 0;
                    CustomEventListener.dispatchEvent(EventName.GAME_OVER);
                }
            }

            if(this._currRoadPoint!.moveType === RoadPoint.RoadMoveType.BEND){
                if (this._currRoadPoint!.clockwise) {
                    this._originRotation = this._currRotation = this._originRotation <= 0 ? this._originRotation + 360 : this._originRotation;
                    this._targetRotation = this._originRotation - 90;

                    if ((this._pointB.z < this._pointA.z && this._pointB.x > this._pointA.x) ||
                        (this._pointB.z > this._pointA.z && this._pointB.x < this._pointA.x)) {
                        this._centerPoint.set(this._pointB.x, 0, this._pointA.z);
                    } else {
                        this._centerPoint.set(this._pointA.x, 0, this._pointB.z);
                    }
                } else {
                    this._originRotation = this._currRotation = this._originRotation >= 360 ? this._originRotation - 360 : this._originRotation;
                    this._targetRotation = this._originRotation + 90;

                    if ((this._pointB.z > this._pointA.z && this._pointB.x > this._pointA.x) ||
                        (this._pointB.z < this._pointA.z && this._pointB.x < this._pointA.x)) {
                        this._centerPoint.set(this._pointB.x, 0, this._pointA.z);
                    } else {
                        this._centerPoint.set(this._pointA.x, 0, this._pointB.z);
                    }
                }

                Vec3.subtract(_tempVec, this._pointA, this._centerPoint);
                const r = _tempVec.length();
                this._rotMeasure = 90 / (Math.PI * r / 2);

            }
        } else {
            this._isMoving = false;
            this._currSpeed = 0;
            this._currRoadPoint = null;

            if(this._overCD){
                this._overCD(this);
                this._overCD = null;
            }
        }
    }
    
    //监听碰撞开始
    private _onCollisionEnter(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        if(otherCollider.node.name === 'group'){
            return;
        }

        const otherRigidBody = otherCollider.node.getComponent(RigidBody)!;
        otherRigidBody.useGravity = true; //加上重力，否则碰上后，失重了
        otherRigidBody.applyForce(new Vec3(0, 3000, -1500), new Vec3(0, 0.5, 0));

        const collider = event.selfCollider;
        collider.addMask(Constants.CarGroup.NORMAL);
        const rigidBody = this.node.getComponent(RigidBody)!;
        rigidBody.useGravity = true;
        this._runState = RunState.CRASH;
        AudioManager.playSound(Constants.AudioSource.CRASH);
        CustomEventListener.dispatchEvent(EventName.GAME_OVER);
    }
    
    //接客人
    private _greetingCustomer(){
        const runtimeData = RunTimeData.instance();
        runtimeData.isTakeOver = false;
        this._runState = RunState.INORDER;
        this._currSpeed = 0;
        this._isMoving = false;
        this._gas!.stop();
        CustomEventListener.dispatchEvent(EventName.GREETING, this.node.worldPosition, this._currRoadPoint!.direction);
    }
    
    //送客人
    private _takingCustomer(){
        const runtimeData = RunTimeData.instance();
        runtimeData.isTakeOver = true;
        runtimeData.currProgress ++;
        this._runState = RunState.INORDER;
        this._currSpeed = 0;
        this._isMoving = false;
        this._gas!.stop();
        CustomEventListener.dispatchEvent(EventName.GOODBYE, this.node.worldPosition, this._currRoadPoint!.direction);
        CustomEventListener.dispatchEvent(EventName.SHOW_COIN, this.node.worldPosition);
    }

    private _finishedWalk(){
        if(this._isMain){
            this._runState = RunState.NORMAL;
            this._gas!.play();
        }
    }

    private _resetPhysical() {
        const rigidBody = this.node.getComponent(RigidBody)!;
        rigidBody.useGravity = false;
        rigidBody.sleep();
        rigidBody.wakeUp();
    }
}
