import GameManager from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreAnimator extends cc.Component {
   
    game:GameManager=null;
    reuse(game:GameManager) {
        this.game = game;
    }

    despawn() {
        this.game.despawnAnimRoot();
    }
}
