import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyD')
export class KeyD extends Key {
  key = KeyCode.KEY_D;
}
