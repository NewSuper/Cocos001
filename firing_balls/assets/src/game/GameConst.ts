import SingletonClass from "../common/base/SingletonClass";

export default class GameConst extends SingletonClass {
    static ins() {
        return super.ins() as GameConst;
    }

    readonly ball_init_x = 0;
    readonly ball_init_y = -400;
    readonly ball_speed = 1000;
    readonly ball_radius = 15;

    readonly brick_radius = 43;
    readonly brick_init_x = 0;
    readonly brick_init_y = 500;

    readonly max_ball_init_count = 60;
    readonly max_ball_fire_speed = 10;

    readonly theme_price = 500;
    readonly sign_interval_sec = 3600;

    readonly theme_config: { color: cc.Color[], theme: string }[] = [
        {
            color: [
                cc.color(0, 232, 231), cc.color(0, 232, 132), cc.color(0, 232, 52), cc.color(125, 232, 52), cc.color(190, 190, 50),
                cc.color(150, 220, 40), cc.color(230, 215, 40), cc.color(230, 80, 20), cc.color(228, 35, 20), cc.color(228, 0, 20)
            ],
            theme: 'theme0'
        },
    ]

    readonly brick_type_percent = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,//正方形
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1,//圆
        2, 2, 2, 2, 2, //六边形
        3,  //三角1
        4,  //三角2
        5,  //三角3
        6,  //三角4
        7, 7, 7, 7, 7, 7, 7, 7, 7,  //球
        8, 8,  //星1 正
        9,   //星1 圆
        10, //星2 六
        // 11, //道具1
        // 12, //道具2
        // 13  //道具3
    ];

}