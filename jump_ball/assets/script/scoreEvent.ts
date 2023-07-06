import { _decorator, Component, Node, Label, game } from "cc";
import { gameData, GameState } from "./data/gameState";
const { ccclass, property } = _decorator;

export function zeroFill(num: number, size: number) {
	var s = "000000000" + num;
	return s.substr(s.length - size);
}

@ccclass("ScoreEvent")
export class ScoreEvent extends Component {
	@property(Node)
	gameLoad: Node = null;

	@property(Node)
	gameStartUI: Node = null;

	@property(Node)
	gameOverUI: Node = null;


	@property(Label)
	timeLabel: Label = null;

	@property(Label)
	scoreLabel: Label = null;

	set score(val: number) {
		this._score = val;
		this.scoreLabel.string = val + "";
	}

	get score() {
		return this._score;
	}

	onLoad() {
		game.on("add-score", this.addScore, this);
		game.on("reset-score", this.resetScore, this);
		game.on("start-touch", this.startTouch, this);
		game.on("game-over", this.gameOver, this);
		gameData.gameState = GameState.gameLoad;
	}

	start() {
		this.showUI(this.gameLoad);
	}

	update(deltaTime: number) {
		this._time += deltaTime;
		//this.setTimeLabel();
	}

	setTimeLabel() {
		let second = this._time | (0 / 60);
		let ms = ((this._time - (this._time | 0)) * 100) | 0;
		this.timeLabel.string = second + ":" + zeroFill(ms, 2);
	}

	startTouch() {
		this.showUI(this.gameStartUI);
	}

	gameOver() {
		this.showUI(this.gameOverUI);
	}

	showUI(node: Node) {
		this.gameLoad.active = false;
		this.gameStartUI.active = false;
		this.gameOverUI.active = false;

		node.active = true;
	}

	bonus: number = 0;
	addScore() {
		console.log('addScore')
		this.bonus++;
		this.score = this.score + this.bonus;
	}
	resetScore() {
		this.bonus = 0;
	}

	restart(){
		game.restart();
	}
	private _score: number = 0;
	private _time: number = 0;
}
