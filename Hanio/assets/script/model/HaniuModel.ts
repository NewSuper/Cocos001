
export default class HanioModel {
    countList: number[][] = []

    //构造,在new的自动调用
    constructor(n: number) {
        this.countList.length = n;
        //二维数组的初始化
        for (let i = 0; i < n; i++) {
            this.countList[i] = [];
        }
        
    }

    getLast(index: number) {
        return this.countList[index][this.countList[index].length - 1];
    }

    place(oldIndex: number, newIndex: number) {

        let oldLength = this.countList[oldIndex].length;
        let newLength = this.countList[newIndex].length;

        let oldWidth = this.countList[oldIndex][oldLength - 1];
        let newWidth = this.countList[newIndex][newLength - 1];

        if (oldIndex == newIndex || oldWidth>newWidth){
            return false;
        }
        //汉诺塔砖块位置移动
        let wid=this.countList[oldIndex].pop();
        this.countList[newIndex].push(wid);
        return true;
    }

    isWinGame(){
        if(this.countList[0].length>0){
            return false;
        }
        let count=0;
        for(let i=0;i<this.countList.length;i++){
            let arr=this.countList[i];
            if(arr.length>0){
                count++;
            }
        }
        //全部移动到另外一个塔中了
        return count==1;
    }
}