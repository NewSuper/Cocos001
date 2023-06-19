import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyG')
export class KeyG extends Key {
  key = KeyCode.KEY_G;
}
