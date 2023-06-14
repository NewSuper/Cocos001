import { loader_mgr } from "../loader/loader_mgr"
import * as utils from "../util"
import SingletonClass from "../base/SingletonClass";
import { LocalStorage, CONST_STORAGE_KEY } from "../localStorage/LocalStorage";

const MUSIC_PATH = "sound/{0}";
const SOUND_PATH = "sound/{0}";

export class AudioPlayer extends SingletonClass {
    private clip_cache: Map<string, cc.AudioClip> = new Map();
    private loading_map: Map<string, boolean> = new Map();

    private curr_music: string;
    private music_id: number = -1;
    private music_volume: number;
    private music_mute: boolean;

    private sound_ids: number[] = [];
    private sound_volume: number;
    private sound_mute: boolean;


    static ins() {
        return super.ins() as AudioPlayer;
    }

    init() {
        this.set_music_mute(LocalStorage.ins().getLocal(CONST_STORAGE_KEY.KEY_MUSIC_IS_MUTE, false));
        this.set_music_volume(LocalStorage.ins().getLocal(CONST_STORAGE_KEY.KEY_MUSIC_VOLUME, 0.5));
        this.set_sound_mute(LocalStorage.ins().getLocal(CONST_STORAGE_KEY.KEY_SOUND_IS_MUTE, false));
        this.set_sound_volume(LocalStorage.ins().getLocal(CONST_STORAGE_KEY.KEY_SOUND_VOLUME, 1));
    }

    flush() {
        // wxapi.wxStorage.set(Consts.Game.SoundMute, this.sound_mute ? "1" : "0");
    }

    //同时只能播放一个
    play_music(name: string) {
        if (this.music_id >= 0) {
            this.stop_music();
        }

        let path = utils.strfmt(MUSIC_PATH, name);
        this.curr_music = name;

        if (this.music_mute) {
            // cc.log("music is mute");
            return;
        }
        let clip = this.clip_cache.get(path);
        if (clip) {
            this.play_clip(clip, this.music_volume, true, AudioType.Music);
        }
        else {
            let task: AudioPlayTask = { type: AudioType.Music, name: name, path: path, volume: this.music_volume, loop: true };
            this.load_task(task);
        }
    }

    stop_music() {
        if (this.music_id < 0) {
            // cc.log("no music is playing");
            return;
        }
        cc.audioEngine.stop(this.music_id);
        this.music_id = -1;
    }

    get_music_mute() {
        return this.music_mute;
    }

    set_music_mute(is_mute: boolean) {
        this.music_mute = is_mute;
        LocalStorage.ins().setLocal(CONST_STORAGE_KEY.KEY_MUSIC_IS_MUTE, is_mute);

        if (this.music_id < 0) {
            if (!is_mute && this.curr_music) {
                this.play_music(this.curr_music);
            }
            return;
        }
        if (is_mute) {
            cc.audioEngine.pause(this.music_id);
        }
        else {
            cc.audioEngine.resume(this.music_id);
        }
    }

    //0~1
    set_music_volume(volume: number) {
        this.music_volume = volume;
        if (this.music_id >= 0) {
            cc.audioEngine.setVolume(this.music_id, volume);
        }
        LocalStorage.ins().setLocal(CONST_STORAGE_KEY.KEY_MUSIC_VOLUME, volume);
    }

    private load_task(task: AudioPlayTask) {
        let path = task.path;
        if (this.loading_map.get(path)) {
            return;
        }
        this.loading_map.set(path, true);
        loader_mgr.get_inst().loadRawAsset(path, utils.gen_handler(this.on_clip_loaded, this, task));
    }

    private on_clip_loaded(task: AudioPlayTask, clip: cc.AudioClip) {
        this.clip_cache.set(task.path, clip);
        if (task.type == AudioType.Music && task.name != this.curr_music) {
            return;
        }
        this.play_clip(clip, task.volume, task.loop, task.type, task.cb);
    }

    private play_clip(clip, volume: number, loop: boolean, type: AudioType, cb?: utils.handler) {
        let aid = cc.audioEngine.play(clip, loop, volume);
        if (type == AudioType.Music) {
            this.music_id = aid;
        }
        else if (type == AudioType.Sound) {
            this.sound_ids.push(aid);
            cc.audioEngine.setFinishCallback(aid, () => {
                this.on_sound_finished(aid);
                cb && cb.exec();
            });
        }
    }

    private on_sound_finished(aid: number) {
        let idx = this.sound_ids.findIndex((id) => {
            return id == aid;
        });
        if (idx != -1) {
            this.sound_ids.splice(idx, 1);
        }
    }

    //可同时播放多个
    play_sound(name: string, cb?: utils.handler) {
        if (this.sound_mute) {
            // cc.log("sound is mute");
            return;
        }
        let path = utils.strfmt(SOUND_PATH, name);
        let clip = this.clip_cache.get(path);
        if (clip) {
            this.play_clip(clip, this.sound_volume, false, AudioType.Sound, cb);
        } else {
            let task: AudioPlayTask = { type: AudioType.Sound, name: name, path: path, volume: this.sound_volume, loop: false, cb };
            this.load_task(task);
        }
    }

    get_sound_mute() {
        return this.sound_mute;
    }

    set_sound_mute(is_mute: boolean) {
        this.sound_mute = is_mute;
        this.sound_ids.forEach((sid) => {
            if (is_mute) {
                cc.audioEngine.pause(sid);
            } else {
                cc.audioEngine.resume(sid);
            }
        });
        LocalStorage.ins().setLocal(CONST_STORAGE_KEY.KEY_SOUND_IS_MUTE, is_mute);
    }

    //0~1
    set_sound_volume(volume: number) {
        this.sound_volume = volume;
        this.sound_ids.forEach((sid) => {
            cc.audioEngine.setVolume(sid, volume);
        });
        LocalStorage.ins().setLocal(CONST_STORAGE_KEY.KEY_SOUND_VOLUME, volume);
    }

    stop_sound() {
        this.sound_ids.forEach((sid) => {
            cc.audioEngine.stop(sid);
        });
        this.sound_ids.length = 0;
    }

    clear_cache() {
        this.clip_cache.forEach((clip, key) => {
            loader_mgr.get_inst().release(clip);
        });
        this.clip_cache.clear();
        this.loading_map.clear();
        cc.audioEngine.uncacheAll();
    }
}

enum AudioType {
    Music = 1,
    Sound = 2,
}

interface AudioPlayTask {
    type: AudioType;
    name: string;
    path: string;
    volume: number;
    loop: boolean;
    cb?: utils.handler;
}

export const AUDIO_CONFIG = {
    Audio_Btn: "button",
    Audio_levelup: "levelup",
    Audio_star: "star",
    Audio_balls: "balls",
    Audio_Bgm: "bg",
    Audio_gameover: "gameover",
    Audio_win: "win",
    Audio_congra: "congra",

}