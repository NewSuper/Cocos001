import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyB')
export class KeyB extends Key {
  key = KeyCode.KEY_B;
}
