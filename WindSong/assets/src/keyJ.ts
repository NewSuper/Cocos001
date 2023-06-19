import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyJ')
export class KeyJ extends Key {
  key = KeyCode.KEY_J;
}
