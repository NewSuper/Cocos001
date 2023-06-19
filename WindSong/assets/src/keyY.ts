import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyY')
export class KeyY extends Key {
  key = KeyCode.KEY_Y;
}
