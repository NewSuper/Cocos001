const { ccclass, property } = cc._decorator;

@ccclass
export default class StartView extends cc.Component {
	@property(cc.SceneAsset)
	nextScene: cc.SceneAsset = null;

	@property({
		type: cc.Label,
		tooltip: "标题",
	})
	
	@property
	label: cc.Label = null;

	onLoad() {
		let score: number = cc.sys.localStorage.getItem("score");
		if (!score) score = 0;
		this.label.string = score.toString();
	}

	start() {}

	buttonStart() {
		cc.director.runScene(this.nextScene);
	}

	buttonExit() {
		cc.game.end();
	}

	// update (dt) {}
}
