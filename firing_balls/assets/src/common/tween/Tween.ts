import { TimerMgr } from "../timer/timer_mgr";
import { gen_handler } from "../util";

//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


/**
 * Tween is the animation easing class of Egret
 * @see http://edn.com/cn/docs/page/576 Tween ease animation
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample extension/tween/Tween.ts
 * @language en_US
 */
/**
 * Tween是Egret的动画缓动类
 * @see http://edn.com/cn/docs/page/576 Tween缓动动画
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample extension/tween/Tween.ts
 * @language zh_CN
 */
export class Tween {
    /**
     * 不做特殊处理
     * @constant {number} Tween.NONE
     * @private
     */
    private static NONE = 0;
    /**
     * 循环
     * @constant {number} Tween.LOOP
     * @private
     */
    private static LOOP = 1;
    /**
     * 倒序
     * @constant {number} Tween.REVERSE
     * @private
     */
    private static REVERSE = 2;

    /**
     * @private
     */
    private static _tweens: Tween[] = [];
    /**
     * @private
     */
    private static IGNORE = {};
    /**
     * @private
     */
    private static _plugins = {};
    /**
     * @private
     */
    private static _inited = false;

    /**
     * @private
     */
    private _target: any = null;
    /**
     * @private
     */
    private _useTicks: boolean = false;
    /**
     * @private
     */
    private ignoreGlobalPause: boolean = false;
    /**
     * @private
     */
    private loop: boolean = false;
    /**
     * @private
     */
    private pluginData = null;
    /**
     * @private
     */
    private _curQueueProps;
    /**
     * @private
     */
    private _initQueueProps;
    /**
     * @private
     */
    private _steps: any[] = null;
    /**
     * @private
     */
    private paused: boolean = false;
    /**
     * @private
     */
    private duration: number = 0;
    /**
     * @private
     */
    private _prevPos: number = -1;
    /**
     * @private
     */
    private position: number = null;
    /**
     * @private
     */
    private _prevPosition: number = 0;
    /**
     * @private
     */
    private _stepPosition: number = 0;
    /**
     * @private
     */
    private passive: boolean = false;
    /**
     * @private
     */
    private onChange: Function
    /**
     * @private
     */
    private onChangeObj

    /**
     * Activate an object and add a Tween animation to the object
     * @param target {any} The object to be activated
     * @param props {any} Parameters, support loop onChange onChangeObj
     * @param pluginData {any} Write realized
     * @param override {boolean} Whether to remove the object before adding a tween, the default value false
     * Not recommended, you can use Tween.removeTweens(target) instead.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 激活一个对象，对其添加 Tween 动画
     * @param target {any} 要激活 Tween 的对象
     * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
     * @param pluginData {any} 暂未实现
     * @param override {boolean} 是否移除对象之前添加的tween，默认值false。
     * 不建议使用，可使用 Tween.removeTweens(target) 代替。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static get(target: any, props?: { loop?: boolean, onChange?: Function, onChangeObj?: any }, pluginData: any = null, override: boolean = false): Tween {
        if (override) {
            Tween.removeTweens(target);
        }
        return new Tween(target, props, pluginData);
    }

    /**
     * Delete all Tween animations from an object
     * @param target The object whose Tween to be deleted
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 删除一个对象上的全部 Tween 动画
     * @param target  需要移除 Tween 的对象
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static removeTweens(target: any): void {
        if (!target.tween_count) {
            return;
        }
        let tweens: Tween[] = Tween._tweens;
        for (let i = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]._target == target) {
                tweens[i].paused = true;
                tweens.splice(i, 1);
            }
        }
        target.tween_count = 0;
    }

    /**
     * Pause all Tween animations of a certain object
     * @param target The object whose Tween to be paused
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 暂停某个对象的所有 Tween
     * @param target 要暂停 Tween 的对象
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static pauseTweens(target: any): void {
        if (!target.tween_count) {
            return;
        }
        let tweens: Tween[] = Tween._tweens;
        for (let i = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]._target == target) {
                tweens[i].paused = true;
            }
        }
    }

    /**
     * Resume playing all easing of a certain object
     * @param target The object whose Tween to be resumed
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 继续播放某个对象的所有缓动
     * @param target 要继续播放 Tween 的对象
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static resumeTweens(target: any): void {
        if (!target.tween_count) {
            return;
        }
        let tweens: Tween[] = Tween._tweens;
        for (let i = tweens.length - 1; i >= 0; i--) {
            if (tweens[i]._target == target) {
                tweens[i].paused = false;
            }
        }
    }

    /**
     * @private
     * 
     * @param delta ms
     * @param paused 
     */
    private static tick(delta: number, paused = false) {
        let tweens: Tween[] = Tween._tweens.concat();
        for (let i = tweens.length - 1; i >= 0; i--) {
            let tween: Tween = tweens[i];
            if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                continue;
            }
            tween.$tick(tween._useTicks ? 1 : delta);
        }
    }

    private static _lastTime: number = 0;
    /**
     * @private
     * 
     * @param tween 
     * @param value 
     */
    private static _register(tween: Tween, value: boolean): void {
        let target: any = tween._target;
        let tweens: Tween[] = Tween._tweens;
        if (value) {
            if (target) {
                target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
            }
            tweens.push(tween);
            if (!Tween._inited) {
                Tween._inited = true;
                TimerMgr.getInst().add_updater(gen_handler((t: number) => {
                    Tween.tick(t * 1000)
                }))
            }
        } else {
            if (target) {
                target.tween_count--;
            }
            let i = tweens.length;
            while (i--) {
                if (tweens[i] == tween) {
                    tweens.splice(i, 1);
                    return;
                }
            }
        }
    }

    /**
     * Delete all Tween
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 删除所有 Tween
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static removeAllTweens(): void {
        let tweens: Tween[] = Tween._tweens;
        for (let i = 0, l = tweens.length; i < l; i++) {
            let tween: Tween = tweens[i];
            tween.paused = true;
            tween._target.tween_count = 0;
        }
        tweens.length = 0;
    }

    /**
     * 创建一个 Tween 对象
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    constructor(target: any, props: any, pluginData: any) {
        this.initialize(target, props, pluginData);
    }

    /**
     * @private
     * 
     * @param target 
     * @param props 
     * @param pluginData 
     */
    private initialize(target: any, props: any, pluginData: any): void {
        this._target = target;
        if (props) {
            this._useTicks = props.useTicks;
            this.ignoreGlobalPause = props.ignoreGlobalPause;
            this.loop = props.loop;
            // props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
            this.onChange = props.onChange;
            this.onChangeObj = props.onChangeObj;
            if (props.override) {
                Tween.removeTweens(target);
            }
        }

        this.pluginData = pluginData || {};
        this._curQueueProps = {};
        this._initQueueProps = {};
        this._steps = [];
        if (props && props.paused) {
            this.paused = true;
        } else {
            Tween._register(this, true);
        }
        if (props && props.position != null) {
            this.setPosition(props.position, Tween.NONE);
        }
    }

    /**
     * @private
     * 
     * @param value 
     * @param actionsMode 
     * @returns 
     */
    public setPosition(value: number, actionsMode: number = 1): boolean {
        if (value < 0) {
            value = 0;
        }

        //正常化位置
        let t: number = value;
        let end: boolean = false;
        if (t >= this.duration) {
            if (this.loop) {
                var newTime = t % this.duration;
                if (t > 0 && newTime === 0) {
                    t = this.duration;
                } else {
                    t = newTime;
                }
            }
            else {
                t = this.duration;
                end = true;
            }
        }
        if (t == this._prevPos) {
            return end;
        }

        if (end) {
            this.setPaused(true);
        }

        let prevPos = this._prevPos;
        this.position = this._prevPos = t;
        this._prevPosition = value;

        if (this._target) {
            if (this._steps.length > 0) {
                // 找到新的tween
                let l = this._steps.length;
                let stepIndex = -1;
                for (let i = 0; i < l; i++) {
                    if (this._steps[i].type == "step") {
                        stepIndex = i;
                        if (this._steps[i].t <= t && this._steps[i].t + this._steps[i].d >= t) {
                            break;
                        }
                    }
                }
                for (let i = 0; i < l; i++) {
                    if (this._steps[i].type == "action") {
                        //执行actions
                        if (actionsMode != 0) {
                            if (this._useTicks) {
                                this._runAction(this._steps[i], t, t);
                            }
                            else if (actionsMode == 1 && t < prevPos) {
                                if (prevPos != this.duration) {
                                    this._runAction(this._steps[i], prevPos, this.duration);
                                }
                                this._runAction(this._steps[i], 0, t, true);
                            }
                            else {
                                this._runAction(this._steps[i], prevPos, t);
                            }
                        }
                    }
                    else if (this._steps[i].type == "step") {
                        if (stepIndex == i) {
                            let step = this._steps[stepIndex];
                            this._updateTargetProps(step, Math.min((this._stepPosition = t - step.t) / step.d, 1));
                        }
                    }
                }
            }
        }

        // this.dispatchEventWith("change");
        this.onChange && this.onChange.call(this.onChangeObj);
        return end;
    }

    /**
     * @private
     * 
     * @param startPos 
     * @param endPos 
     * @param includeStart 
     */
    private _runAction(action: any, startPos: number, endPos: number, includeStart: boolean = false) {
        let sPos: number = startPos;
        let ePos: number = endPos;
        if (startPos > endPos) {
            //把所有的倒置
            sPos = endPos;
            ePos = startPos;
        }
        let pos = action.t;
        if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
            action.f.apply(action.o, action.p);
        }
    }

    /**
     * @private
     * 
     * @param step 
     * @param ratio 
     */
    private _updateTargetProps(step: any, ratio: number) {
        let p0, p1, v, v0, v1, arr;
        if (!step && ratio == 1) {
            this.passive = false;
            p0 = p1 = this._curQueueProps;
        } else {
            this.passive = !!step.v;
            //不更新props.
            if (this.passive) {
                return;
            }
            //使用ease
            if (step.e) {
                ratio = step.e(ratio, 0, 1, 1);
            }
            p0 = step.p0;
            p1 = step.p1;
        }

        for (let n in this._initQueueProps) {
            if ((v0 = p0[n]) == null) {
                p0[n] = v0 = this._initQueueProps[n];
            }
            if ((v1 = p1[n]) == null) {
                p1[n] = v1 = v0;
            }
            if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                v = ratio == 1 ? v1 : v0;
            } else {
                v = v0 + (v1 - v0) * ratio;
            }

            let ignore = false;
            if (arr = Tween._plugins[n]) {
                for (let i = 0, l = arr.length; i < l; i++) {
                    let v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                    if (v2 == Tween.IGNORE) {
                        ignore = true;
                    }
                    else {
                        v = v2;
                    }
                }
            }
            if (!ignore) {
                this._target[n] = v;
            }
        }

    }

    /**
     * Whether setting is paused
     * @param value {boolean} Whether to pause
     * @returns Tween object itself
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置是否暂停
     * @param value {boolean} 是否暂停
     * @returns Tween对象本身
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public setPaused(value: boolean): Tween {
        if (this.paused == value) {
            return this;
        }
        this.paused = value;
        Tween._register(this, !value);
        return this;
    }

    /**
     * @private
     * 
     * @param props 
     * @returns 
     */
    private _cloneProps(props: any): any {
        let o = {};
        for (let n in props) {
            o[n] = props[n];
        }
        return o;
    }

    /**
     * @private
     * 
     * @param o 
     * @returns 
     */
    private _addStep(o): Tween {
        if (o.d > 0) {
            o.type = "step";
            this._steps.push(o);
            o.t = this.duration;
            this.duration += o.d;
        }
        return this;
    }

    /**
     * @private
     * 
     * @param o 
     * @returns 
     */
    private _appendQueueProps(o): any {
        let arr, oldValue, i, l, injectProps;
        for (let n in o) {
            if (this._initQueueProps[n] === undefined) {
                oldValue = this._target[n];
                //设置plugins
                if (arr = Tween._plugins[n]) {
                    for (i = 0, l = arr.length; i < l; i++) {
                        oldValue = arr[i].init(this, n, oldValue);
                    }
                }
                this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
            } else {
                oldValue = this._curQueueProps[n];
            }
        }

        for (let n in o) {
            oldValue = this._curQueueProps[n];
            if (arr = Tween._plugins[n]) {
                injectProps = injectProps || {};
                for (i = 0, l = arr.length; i < l; i++) {
                    if (arr[i].step) {
                        arr[i].step(this, n, oldValue, o[n], injectProps);
                    }
                }
            }
            this._curQueueProps[n] = o[n];
        }
        if (injectProps) {
            this._appendQueueProps(injectProps);
        }
        return this._curQueueProps;
    }

    /**
     * @private
     * 
     * @param o 
     * @returns 
     */
    private _addAction(o): Tween {
        o.t = this.duration;
        o.type = "action";
        this._steps.push(o);
        return this;
    }

    /**
     * @private
     * 
     * @param props 
     * @param o 
     */
    private _set(props: any, o): void {
        for (let n in props) {
            o[n] = props[n];
        }
    }

    /**
     * Wait the specified milliseconds before the execution of the next animation
     * @param duration {number} Waiting time, in milliseconds
     * @param passive {boolean} Whether properties are updated during the waiting time
     * @returns Tween object itself
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 等待指定毫秒后执行下一个动画
     * @param duration {number} 要等待的时间，以毫秒为单位
     * @param passive {boolean} 等待期间属性是否会更新
     * @returns Tween对象本身
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public wait(duration: number, passive?: boolean): Tween {
        if (duration == null || duration <= 0) {
            return this;
        }
        let o = this._cloneProps(this._curQueueProps);
        return this._addStep({ d: duration, p0: o, p1: o, v: passive });
    }

    /**
     * Modify the property of the specified object to a specified value
     * @param props {Object} Property set of an object
     * @param duration {number} Duration
     * @param ease {Ease} Easing algorithm
     * @returns {Tween} Tween object itself
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将指定对象的属性修改为指定值
     * @param props {Object} 对象的属性集合
     * @param duration {number} 持续时间
     * @param ease {Ease} 缓动算法
     * @returns {Tween} Tween对象本身
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */

    public to(props: any, duration?: number, ease: Function = undefined) {
        if (isNaN(duration) || duration < 0) {
            duration = 0;
        }
        this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
        //加入一步set，防止游戏极其卡顿时候，to后面的call取到的属性值不对
        return this.set(props);
    }

    /**
     * Execute callback function
     * @param callback {Function} Callback method
     * @param thisObj {any} this action scope of the callback method
     * @param params {any[]} Parameter of the callback method
     * @returns {Tween} Tween object itself
     * @version Egret 2.4
     * @platform Web,Native
     * @example
     * <pre>
     *  Tween.get(display).call(function (a:number, b:string) {
     *      console.log("a: " + a); // the first parameter passed 233
     *      console.log("b: " + b); // the second parameter passed “hello”
     *  }, this, [233, "hello"]);
     * </pre>
     * @language en_US
     */
    /**
     * 执行回调函数
     * @param callback {Function} 回调方法
     * @param thisObj {any} 回调方法this作用域
     * @param params {any[]} 回调方法参数
     * @returns {Tween} Tween对象本身
     * @version Egret 2.4
     * @platform Web,Native
     * @example
     * <pre>
     *  Tween.get(display).call(function (a:number, b:string) {
     *      console.log("a: " + a); //对应传入的第一个参数 233
     *      console.log("b: " + b); //对应传入的第二个参数 “hello”
     *  }, this, [233, "hello"]);
     * </pre>
     * @language zh_CN
     */
    public call(callback: Function, thisObj: any = undefined, params: any[] = undefined): Tween {
        return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
    }

    /**
     * Now modify the properties of the specified object to the specified value
     * @param props {Object} Property set of an object
     * @param target The object whose Tween to be resumed
     * @returns {Tween} Tween object itself
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * 立即将指定对象的属性修改为指定值
     * @param props {Object} 对象的属性集合
     * @param target 要继续播放 Tween 的对象
     * @returns {Tween} Tween对象本身
     * @version Egret 2.4
     * @platform Web,Native
     */
    public set(props: any, target = null): Tween {
        //更新当前数据，保证缓动流畅性
        this._appendQueueProps(props);
        return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
    }

    /**
     * Execute
     * @param tween {Tween} The Tween object to be operated. Default: this
     * @returns {Tween} Tween object itself
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 执行
     * @param tween {Tween} 需要操作的 Tween 对象，默认this
     * @returns {Tween} Tween对象本身
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public play(tween?: Tween): Tween {
        if (!tween) {
            tween = this;
        }
        return this.call(tween.setPaused, tween, [false]);
    }

    /**
     * Pause
     * @param tween {Tween} The Tween object to be operated. Default: this
     * @returns {Tween} Tween object itself
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 暂停
     * @param tween {Tween} 需要操作的 Tween 对象，默认this
     * @returns {Tween} Tween对象本身
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public pause(tween?: Tween): Tween {
        if (!tween) {
            tween = this;
        }
        return this.call(tween.setPaused, tween, [true]);
    }

    /**
     * @method Tween#tick
     * @param delta {number}
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    public $tick(delta: number): void {
        if (this.paused) {
            return;
        }
        this.setPosition(this._prevPosition + delta);
    }
}

export class Ease {
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    private constructor() {
    }

    /**
     * get.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static get(amount: number) {
        if (amount < -1) {
            amount = -1;
        }
        if (amount > 1) {
            amount = 1;
        }
        return function (t: number) {
            if (amount == 0) {
                return t;
            }
            if (amount < 0) {
                return t * (t * -amount + 1 + amount);
            }
            return t * ((2 - t) * amount + (1 - amount));
        }
    }

    /**
     * get pow in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get pow in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getPowIn(pow: number) {
        return function (t: number) {
            return Math.pow(t, pow);
        }
    }

    /**
     * get pow out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get pow out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getPowOut(pow: number) {
        return function (t: number) {
            return 1 - Math.pow(1 - t, pow);
        }
    }

    /**
     * get pow in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get pow in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getPowInOut(pow: number) {
        return function (t: number) {
            if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
            return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
        }
    }

    /**
     * quad in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quad in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quadIn = Ease.getPowIn(2);
    /**
     * quad out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quad out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quadOut = Ease.getPowOut(2);
    /**
     * quad in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quad in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quadInOut = Ease.getPowInOut(2);
    /**
     * cubic in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * cubic in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static cubicIn = Ease.getPowIn(3);
    /**
     * cubic out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * cubic out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static cubicOut = Ease.getPowOut(3);
    /**
     * cubic in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * cubic in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static cubicInOut = Ease.getPowInOut(3);
    /**
     * quart in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quart in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quartIn = Ease.getPowIn(4);
    /**
     * quart out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quart out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quartOut = Ease.getPowOut(4);
    /**
     * quart in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quart in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quartInOut = Ease.getPowInOut(4);
    /**
     * quint in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quint in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quintIn = Ease.getPowIn(5);
    /**
     * quint out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quint out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quintOut = Ease.getPowOut(5);
    /**
     * quint in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * quint in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static quintInOut = Ease.getPowInOut(5);

    /**
     * sine in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * sine in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static sineIn(t: number) {
        return 1 - Math.cos(t * Math.PI / 2);
    }

    /**
     * sine out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * sine out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static sineOut(t: number) {
        return Math.sin(t * Math.PI / 2);
    }

    /**
     * sine in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * sine in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static sineInOut(t: number) {
        return -0.5 * (Math.cos(Math.PI * t) - 1)
    }

    /**
     * get back in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get back in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getBackIn(amount: number) {
        return function (t: number) {
            return t * t * ((amount + 1) * t - amount);
        }
    }

    /**
     * back in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * back in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static backIn = Ease.getBackIn(1.7);

    /**
     * get back out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get back out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getBackOut(amount: number) {
        return function (t) {
            return (--t * t * ((amount + 1) * t + amount) + 1);
        }
    }

    /**
     * back out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * back out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static backOut = Ease.getBackOut(1.7);

    /**
     * get back in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get back in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getBackInOut(amount: number) {
        amount *= 1.525;
        return function (t: number) {
            if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
            return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
        }
    }

    /**
     * back in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * back in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static backInOut = Ease.getBackInOut(1.7);

    /**
     * circ in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * circ in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static circIn(t: number) {
        return -(Math.sqrt(1 - t * t) - 1);
    }

    /**
     * circ out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * circ out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static circOut(t: number) {
        return Math.sqrt(1 - (--t) * t);
    }

    /**
     * circ in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * circ in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static circInOut(t: number) {
        if ((t *= 2) < 1) {
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }

    /**
     * bounce in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * bounce in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static bounceIn(t: number) {
        return 1 - Ease.bounceOut(1 - t);
    }

    /**
     * bounce out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * bounce out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static bounceOut(t: number) {
        if (t < 1 / 2.75) {
            return (7.5625 * t * t);
        } else if (t < 2 / 2.75) {
            return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
        } else if (t < 2.5 / 2.75) {
            return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
        } else {
            return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
        }
    }

    /**
     * bounce in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * bounce in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static bounceInOut(t: number) {
        if (t < 0.5) return Ease.bounceIn(t * 2) * .5;
        return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
    }

    /**
     * get elastic in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get elastic in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getElasticIn(amplitude: number, period: number) {
        let pi2 = Math.PI * 2;
        return function (t: number) {
            if (t == 0 || t == 1) return t;
            let s = period / pi2 * Math.asin(1 / amplitude);
            return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
        }
    }

    /**
     * elastic in.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * elastic in。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static elasticIn = Ease.getElasticIn(1, 0.3);

    /**
     * get elastic out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get elastic out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getElasticOut(amplitude: number, period: number) {
        let pi2 = Math.PI * 2;
        return function (t: number) {
            if (t == 0 || t == 1) return t;
            let s = period / pi2 * Math.asin(1 / amplitude);
            return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
        }
    }

    /**
     * elastic out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * elastic out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static elasticOut = Ease.getElasticOut(1, 0.3);

    /**
     * get elastic in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * get elastic in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static getElasticInOut(amplitude: number, period: number) {
        let pi2 = Math.PI * 2;
        return function (t: number) {
            let s = period / pi2 * Math.asin(1 / amplitude);
            if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
        }
    }

    /**
     * elastic in out.See example.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * elastic in out。请查看示例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public static elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
}

