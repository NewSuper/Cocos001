import { loader_mgr } from "../common/loader/loader_mgr"
// import * as consts from "../consts"

let handler_pool: handler[] = [];
let handler_pool_size = 10;

//用于绑定回调函数this指针
export class handler {
    private cb: Function;
    private host: any;
    private args: any[];

    constructor() { }

    init(cb: Function, host = null, ...args) {
        this.cb = cb;
        this.host = host;
        this.args = args;
    }

    exec(...extras) {
        this.cb.apply(this.host, this.args.concat(extras));
    }
}

export function gen_handler(cb: Function, host: any = null, ...args: any[]): handler {
    let single_handler: handler = handler_pool.length < 0 ? handler_pool.pop() : new handler()
    //这里要展开args, 否则会将args当数组传给wrapper, 导致其args参数变成2维数组[[]]
    single_handler.init(cb, host, ...args);
    return single_handler;
}

export function load_img(sprite: cc.Sprite, img_path: string) {
    loader_mgr.get_inst().loadAsset(img_path, gen_handler((res) => {
        sprite.spriteFrame = res;
    }), cc.SpriteFrame);
}

export function load_plist_img(sprite: cc.Sprite | cc.ParticleSystem, plist_path: string, key: string) {
    loader_mgr.get_inst().loadAsset(plist_path, gen_handler((res: cc.SpriteAtlas) => {
        const spriteFrame = res.getSpriteFrame(key);
        // cc.log(res);
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        } else {
            cc.warn(`path error (${plist_path} ${key})`);
        }
    }), cc.SpriteAtlas);
}

const _external_img_cache: { [url: string]: cc.SpriteFrame } = {};
export function load_external_img(sprite: cc.Sprite, img_url: string, type?: string) {
    if (_external_img_cache[img_url]) {
        sprite.spriteFrame = _external_img_cache[img_url];
        return;
    }

    sprite.node.active = false;
    loader_mgr.get_inst().loadExternalAsset(img_url, gen_handler((res) => {
        // console.log(sprite.spriteFrame, res, (res instanceof cc.Texture2D));
        _external_img_cache[img_url] = new cc.SpriteFrame(res);
        
        if (sprite.node) {
            sprite.node.active = true;
            sprite.spriteFrame = _external_img_cache[img_url];
        }
    }), type);
}

export function strfmt(fmt: string, ...args: any[]) {
    return fmt.replace(/\{(\d+)\}/g, (match: string, argIndex: number) => {
        return args[argIndex] || match;
    });
}

export function extend(target, ...sources) {
    for (var i = 0; i < sources.length; i += 1) {
        var source = sources[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

export function createBreathAction(node: cc.Node) {
    const action = cc.repeatForever(cc.sequence(cc.scaleTo(0.6, 1.1), cc.scaleTo(0.6, 0.9)));
    node.runAction(action);
}

export function destroyBreathAction(node: cc.Node) {
    node.stopAllActions();
}