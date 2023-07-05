var scoreInfo = {
    time :  10,
    kill : 0,
    killScore : 0,
    continuityKill : 0,
    weight : 2,
    scoreAdd : function(k=1){
        this.kill += k;
        this.continuityKill += k;
        if(this.continuityKill > 1){
            this.killScore += (k * this.weight + this.continuityKill);
        }else{
            this.killScore += (k * this.weight);
        }
    },
};
module.exports = scoreInfo;