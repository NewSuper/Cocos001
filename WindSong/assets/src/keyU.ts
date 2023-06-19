import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyU')
export class KeyU extends Key {
  key = KeyCode.KEY_U;
}
