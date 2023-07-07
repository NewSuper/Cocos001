
export default class GameDate {
    level:number=3;

    private static instace:GameDate=null;

    public static get Instance(){
        if(GameDate.instace==null){
            GameDate.instace=new GameDate();
        }
        return GameDate.instace;
    }
}
