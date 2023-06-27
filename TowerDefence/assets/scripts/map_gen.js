
cc.Class({
    extends: cc.Component,

    properties: {
        is_debug: false,
    },

    // use this for initialization
    onLoad: function () {
        this.anim_com = this.node.getComponent(cc.Animation);
        var clips = this.anim_com.getClips();
        var clip = clips[0];
        
        this.graphics = this.node.addComponent(cc.Graphics);
        this.graphics.fillColor = cc.color(255, 0, 0, 255);
        var paths = clip.curveData.paths;
        // console.log(paths);
        
        this.road_data_set = [];
        
        var k;
        for (k in paths) {
            var road_data = paths[k].props.position;
            this.gen_path_data(road_data);
        }

        if (this.is_debug) {
            this.draw_roads();
        }
    },
    
    start: function() {
        /*
        // test()
        var actor = cc.find("UI_ROOT/map_root/ememy_gorilla").getComponent("actor");
        // actor.gen_at_road(this.road_data_set[0]);
        
        actor = cc.find("UI_ROOT/map_root/ememy_small2").getComponent("actor");
        // actor.gen_at_road(this.road_data_set[1]);
        
        actor = cc.find("UI_ROOT/map_root/ememy_small3").getComponent("actor");
        actor.gen_at_road(this.road_data_set[2]);
        */
        // end 
    },
    
    get_road_set: function() {
        return this.road_data_set;
    },
    
    gen_path_data: function(road_data) {
        var ctrl1 = null;
        var start_point = null;
        var end_point = null;
        var ctrl2 = null;
        
        var road_curve_path = []; // [start_point, ctrl1, ctrl2, end_point],
        for(var i = 0; i < road_data.length; i ++) {
            var key_frame = road_data[i];
            if (ctrl1 !== null) {
                road_curve_path.push([start_point, ctrl1, ctrl1, cc.v2(key_frame.value[0], key_frame.value[1])]);
            }
            
            start_point = cc.v2(key_frame.value[0], key_frame.value[1]);
            
            for(var j = 0; j < key_frame.motionPath.length; j ++) {
                var end_point = cc.v2(key_frame.motionPath[j][0], key_frame.motionPath[j][1]);
                ctrl2 = cc.v2(key_frame.motionPath[j][2], key_frame.motionPath[j][3]);
                if (ctrl1 === null) {
                    ctrl1 = ctrl2;
                }
                // 贝塞尔曲线 start_point, ctrl1, ctrl2, end_point,
                road_curve_path.push([start_point, ctrl1, ctrl2, end_point]);
                ctrl1 = cc.v2(key_frame.motionPath[j][4], key_frame.motionPath[j][5]);
                start_point = end_point;
            }
        }
        
        console.log(road_curve_path);
        
        var one_road = [road_curve_path[0][0]];
        
        for(var index = 0; index < road_curve_path.length; index ++) {
            start_point = road_curve_path[index][0];
            ctrl1 = road_curve_path[index][1];
            ctrl2 = road_curve_path[index][2];
            end_point = road_curve_path[index][3];
            
            var len = this.bezier_length(start_point, ctrl1, ctrl2, end_point);
            var OFFSET = 16;
            var count = len / OFFSET;
            count = Math.floor(count);
            var t_delta = 1 / count;
            var t = t_delta;
            
            for(var i = 0; i < count; i ++) {
                var x = start_point.x * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.x * t * (1 - t) * (1 - t) + 3 * ctrl2.x * t * t * (1 - t) + end_point.x * t * t * t;
                var y = start_point.y * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.y * t * (1 - t) * (1 - t) + 3 * ctrl2.y * t * t * (1 - t) + end_point.y * t * t * t;
                one_road.push(cc.v2(x, y));
                t += t_delta;
            }
        }
        
        console.log(one_road);
        this.road_data_set.push(one_road);
    }, 

    draw_roads(path) {
        this.graphics.clear();

        for(var j = 0; j < this.road_data_set.length; j ++) {
            var path = this.road_data_set[j];

            for(var i = 0; i < path.length; i ++) {
                this.graphics.moveTo(path[i].x - 1, path[i].y + 1);
                this.graphics.lineTo(path[i].x - 1, path[i].y - 1);
                this.graphics.lineTo(path[i].x + 1, path[i].y - 1);
                this.graphics.lineTo(path[i].x + 1, path[i].y + 1);
                this.graphics.close(); // 组成一个封闭的路径
            }
        }
        
        // 画先，填充;
        // this.graphics.stroke();
        this.graphics.fill();
    }, 

    bezier_length: function(start_point, ctrl1, ctrl2, end_point) {
        // t [0, 1] t 分成20等分 1 / 20 = 0.05
        var prev_point = start_point;
        var length = 0;
        var t = 0.05;
        for(var i = 0; i < 20; i ++) {
            var x = start_point.x * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.x * t * (1 - t) * (1 - t) + 3 * ctrl2.x * t * t * (1 - t) + end_point.x * t * t * t;
            var y = start_point.y * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.y * t * (1 - t) * (1 - t) + 3 * ctrl2.y * t * t * (1 - t) + end_point.y * t * t * t;
            var now_point = cc.v2(x, y);
            // var dir = cc.pSub(now_point, prev_point);
            var dir = now_point.sub(prev_point);
            prev_point = now_point;
            length += dir.mag();
            
            t += 0.05;
        }
        return length;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
