import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyX')
export class KeyX extends Key {
  key = KeyCode.KEY_X;
}
