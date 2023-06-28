import { Vec2 } from "cc";

export default class MathUtil {

    private static _instance: MathUtil = null;
    public static get instance() {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance;
    }

    public static readonly Deg2Rad: number = 0.0174532924;
    public static readonly Rad2Deg: number = 57.29578;

    public static currency_chinese: Array<any> = [
        { "name": "亿", num: 100000000 },
        { "name": "万", num: 10000 },
    ];

    public static currency_international: Array<any> = [
        { "name": "B", num: 1000000000 },
        { "name": "M", num: 1000000 },
    ];

    public static current_currency_setting: Array<any> = MathUtil.currency_chinese;

    public static globalPoint: Vec2 = new Vec2();
    // public static globalMapPos: MapPos = new MapPos();

    /**
    * 随机浮点数
    */
    public static randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
    * 随机整数
    */
    public static randomRangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
    * 范围限制
    */
    public static rangeLimit(num: number, min: number, max: number): number {
        if (num < min) {
            num = min;
        }
        if (num > max) {
            num = max;
        }
        return num;
    }

    /**
    * 角度转弧度
    */
    public static degToRad(deg: number): number {
        return deg * MathUtil.Deg2Rad;
    }
    /**
      * 弧度转角度
      */
    public static radToDeg(rad: number): number {
        return rad * MathUtil.Rad2Deg;
    }

    /**
    * 规范化角度
    */
    public static normalizeDeg(deg: number): number {
        if (deg >= 0 && deg < 360) {
            return deg;
        }
        deg %= 360;
        if (deg < 0) {
            deg += 360;
        }
        return deg;
    }

    /**
     * 获取弧度
     */
    public static getRad(x: number, y: number): number {
        return Math.atan2(y, x);
    }

    /**
     * 获取弧度
     */
    public static getRad2(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    /**
     * 获取弧度
     */
    public getRadByPoint(v1: Vec2, v2: Vec2): number {
        return Math.atan2(v2.y - v1.y, v2.x - v1.x,);
    }

    /**
     * 获取角度
     */
    public static getDeg(x: number, y: number, normalized: boolean = false): number {
        var deg: number = MathUtil.radToDeg(Math.atan2(y, x));
        if (normalized) {
            deg = MathUtil.normalizeDeg(deg);
        }
        return deg;
    }

    /**
     * 获取角度
     */
    public static getDeg2(x1: number, y1: number, x2: number, y2: number, normalized: boolean = false): number {
        return MathUtil.getDeg(x2 - x1, y2 - y1, normalized);
    }

    /**
     * 获取角度
     */
    public static getDegByPoint(v1: Vec2, v2: Vec2, normalized: boolean = false): number {
        return MathUtil.getDeg(v2.x - v1.x, v2.y - v1.y, normalized);
    }

    /**
     * 获取距离
     */
    public static getDistance(x: number, y: number): number {
        return Math.sqrt(x * x + y * y);
    }

    /**
     * 获取距离
     */
    public static getDistance2(x1: number, y1: number, x2: number, y2: number): number {
        return MathUtil.getDistance(x2 - x1, y2 - y1);
    }

    /**
     * 获取距离
     */
    public static getDistanceByPoint(v1: Vec2, v2: Vec2): number {
        return MathUtil.getDistance(v2.x - v1.x, v2.y - v1.y);
    }

    /**
     * 获取地图距离
     */
    public static getMapDist(x1: number, x2: number): number {
        if (x1 > x2) {
            return x1 - x2;
        } else {
            return x2 - x1;
        }
    }

    /**
    * 获取地图距离
    */
    public static getMapDist2(x1: number, y1: number, x2: number, y2: number): number {
        var offsetX: number = x1 - x2;
        var offsetY: number = y1 - y2;
        if (offsetX < 0)
            offsetX = -offsetX;
        if (offsetY < 0)
            offsetY = -offsetY;
        return offsetX > offsetY ? offsetX : offsetY;
    }

    /**
      * 获取平方
      */
    public static getSquare(x: number, y: number): number {
        return x * x + y * y;
    }

    /**
    * 获取平方
    */
    public static getSquare2(x1: number, y1: number, x2: number, y2: number): number {
        return MathUtil.getSquare(x2 - x1, y2 - y1);
    }

    /**
    * 获取平方
    */
    public static getSquareByPoint(v1: Vec2, v2: Vec2): number {
        return MathUtil.getSquare(v2.x - v1.x, v2.y - v1.y);
    }

    /**
    * 获取直角边长
    */
    public static getRightSide(x1: number, y1: number, x2: number, y2: number, length: number, point?: Vec2): Vec2 {
        if (point == null) {
            point = new Vec2();
        }
        var rad: number = MathUtil.getRad2(x1, y1, x2, y2);
        var x: number = length * Math.cos(rad);
        var y: number = length * Math.sin(rad);
        point.x = x;
        point.y = y;
        return point;
    }

    /**
    * 获取直角边长
    */
    public static getRightSideByPoint(v1: Vec2, v2: Vec2, length: number, point?: Vec2): Vec2 {
        return MathUtil.getRightSide(v1.x, v1.y, v2.x, v2.y, length, point);
    }

    /**
    * 线性插值获取线段(x1, y1) (x2, y2)上距离点(x1, y1)位移为length的点
    */
    public static getLinePoint(x1: number, y1: number, x2: number, y2: number, length: number, point?: Vec2): Vec2 {
        if (point == null) {
            point = new Vec2();
        }
        var dist: number = MathUtil.getDistance2(x1, y1, x2, y2);
        var rate = length / dist;
        point.x = x1 + rate * (x2 - x1);
        point.y = y1 + rate * (y2 - y1);
        return point;
    }

    /**
      * 线性插值获取线段(x1, y1) (x2, y2)上距离点(x1, y1)位移为length的点
      */
    public static getLinePointByPoint(v1: Vec2, v2: Vec2, length: number, point?: Vec2): Vec2 {
        return MathUtil.getLinePoint(v1.x, v1.y, v2.x, v2.y, length, point);
    }

    /**
    * 根据弧度获取距离点(x, y)length长度的点
    */
    public static getLinePoint2(x: number, y: number, length: number, rad: number, point?: Vec2): Vec2 {
        if (point == null) {
            point = new Vec2();
        }
        point.x = x + length * Math.cos(rad);
        point.y = y + length * Math.sin(rad);
        return point;
    }

    /**
    * 根据弧度获取距离点(x, y)length长度的点
    */
    public static getLinePoint2ByPoint(v: Vec2, length: number, rad: number, point?: Vec2): Vec2 {
        return MathUtil.getLinePoint2(v.x, v.y, length, rad, point);
    }

    /**
    * 获取二次贝塞尔曲线点
    * x1,y1:起点
    * x2,y2:终点
    * x3,y3:控制点
    */
    public static getCubicBezierPoint(t: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, point?: Vec2): Vec2 {
        if (point == null) {
            point = new Vec2();
        }
        var u: number = 1 - t;
        var tt: number = t * t;
        var uu: number = u * u;
        var ut2: number = u * t * 2;
        point.x = uu * x1 + ut2 * x3 + tt * x2;
        point.y = uu * y1 + ut2 * y3 + tt * y2;
        return point;
    }

    /**
    * 获取二次贝塞尔曲线点
    */
    public static getCubicBezierPointByPoint(t: number, p1: Vec2, p2: Vec2, p3: Vec2, point?: Vec2): Vec2 {
        return MathUtil.getCubicBezierPoint(t, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, point);
    }
    /**
      * 单位转换
      */
    public static convertUnits(num: number, unit: number, unitChar: string): string {
        return Math.floor(num / unit) + unitChar;
    }

    /**
    * 单位转换
    */
    public static formatUnits(num: number, short: boolean = true): string {
        if (short) {
            for (var setting of this.current_currency_setting) {
                if (num >= setting.num) {
                    return Math.floor(num / setting.num) + setting.name;
                }
            }
            return "" + num;
        } else {
            var text: string = "";
            for (var setting of this.current_currency_setting) {
                if (num >= setting.num) {
                    text += Math.floor(num / setting.num) + setting.name;
                    num %= setting.num;
                }
            }
            if (num != 0) {
                text += num;
            }
            return text;
        }
    }

    /**
    * 货币格式转换
    */
    public static currencyFormat(num: number): string {
        var numInt: number = Math.floor(num);
        var dec: number = num - numInt;

        // 整数部分
        var numStr: string = "" + numInt;
        var str: string = "";
        var length: number = numStr.length;
        while (length > 0) {
            var c: number = length >= 3 ? 3 : length;
            str = numStr.substr(length - c, c) + str;
            length -= c;
            if (length != 0) {
                str = "," + str;
            }
        }

        // 小数部分
        if (dec > 0) {
            var decStr: string = "" + dec;
            var index: number = decStr.indexOf(".");
            str += decStr.substr(index, decStr.length - index);
        }
        return str;
    }
}