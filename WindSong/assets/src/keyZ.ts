import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyZ')
export class KeyZ extends Key {
  key = KeyCode.KEY_Z;
}
