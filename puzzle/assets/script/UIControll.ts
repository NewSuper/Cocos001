import Board from "./Board";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(Board)
    board:Board=null;

    select:number=3;

    toggleSelect(event:cc.Event.EventCustom,data:string){
        console.log(event,data);
        this.select=parseInt(data);
    }

    startGame () {
        if(this.board){
            this.board.startGame(this.select);
        }
    }

}
