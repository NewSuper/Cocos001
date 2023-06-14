export default class SingletonClass {
    protected constructor() { }
    private static _ins: SingletonClass;
    public static ins() {
        if (!this._ins) {
            this._ins = new this;
        }
        return this._ins;
    }
}