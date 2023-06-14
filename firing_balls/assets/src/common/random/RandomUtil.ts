import SingletonClass from "../base/SingletonClass";

export enum RandomSeedType {
    UNDEFINED = 0,
}

export class RandomUtil extends SingletonClass {
    public static ins() {
        return super.ins() as RandomUtil
    }

    private _seeds: number[][] = []
    private _seedIndex: number[] = [];
    private _selectedIndexes: number[][] = []
    private _randomSeed = '0123456789abcdef'

    public init(randomSeed: string = '0123456789abcdef') {
        this._randomSeed = randomSeed;

        const keysAll = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        this._seeds = [];
        this._selectedIndexes = [];
        this._seedIndex = [];
        for (const key of keysAll) {
            this.resetSeed(key)
        }
    }

    public resetSeed(randomSeedType: RandomSeedType) {
        this._seeds[randomSeedType] = []
        this._selectedIndexes[randomSeedType] = [];
        this._seedIndex[randomSeedType] = 0;

        for (let i: number = 0; i < this._randomSeed.length; i++) {
            let fix: number = parseInt(this._randomSeed[i], 36) || 0;
            fix = (9301 * fix + 49297) % (10485763) || 0;
            this._seeds[randomSeedType].push(fix)
        }
    }

    public randomNum(min: number, max: number, randomSeedType: RandomSeedType = RandomSeedType.UNDEFINED): number {
        if (min > max)
            max = min
        const seedIndex = this._seedIndex[randomSeedType] % this._randomSeed.length
        const ret = min + (this._seeds[randomSeedType][seedIndex]) % (max - min + 1)
        this._seeds[randomSeedType][seedIndex] = (9301 * this._seeds[randomSeedType][seedIndex] + 49297) % (10485763) || 0
        this._seedIndex[randomSeedType]++;
        this._selectedIndexes[randomSeedType].push(ret)
        return ret
    }

    public randomNumArray(min: number, max: number, count: number, randomSeedType: RandomSeedType = RandomSeedType.UNDEFINED): number[] {
        if (min > max)
            max = min
        const ret = []
        if (max - min + 1 < count) {
            count = max - min + 1
        }
        for (let i = 0; i < count;) {
            const randomNum = this.randomNum(min, max, randomSeedType)
            if (ret.indexOf(randomNum) < 0) {
                ret.push(randomNum)
                i++;
            }
        }
        return ret
    }

    /**百分比概率 */
    public getPercentProbability(percent: number, randomSeedType: RandomSeedType = RandomSeedType.UNDEFINED): boolean {
        const randomNum = this.randomNum(1, 100, randomSeedType)
        // egret.log("getPercentProbability", percent, randomNum)
        return (percent >= randomNum)
    }

}