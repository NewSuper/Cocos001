const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad(){
        cc.director.preloadScene('game');
    }

    startGame(){
        cc.director.loadScene('game', ()=>{
            cc.log('start_game');
        });
    }
}
