import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

export class GameData {
    private _score: number = 0;
    get Score(): number { return this._score; }
    SetScore(score: number) {
        this._score = score;
    }


    private static _instance: GameData = null!;
    static getInstance() {
        if (!this._instance) {
            this._instance = new GameData();
        }
        return this._instance;
    }

    private constructor() {

    }
}

