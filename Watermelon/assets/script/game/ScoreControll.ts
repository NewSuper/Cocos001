import { Global_Date } from "../Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Label)
  scoreLabel: cc.Label = null;
  onLoad() {
    this.node.on("addScore", this.addScore, this);
  }

  addScore() {
    if (this.scoreLabel) {
      this.scoreLabel.string = Global_Date.Score.toString();
    }
    cc.sys.localStorage.setItem("score", Global_Date.Score);
  }

  // update (dt) {}
}
