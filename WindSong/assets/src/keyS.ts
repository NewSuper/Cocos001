import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyS')
export class KeyS extends Key {
  key = KeyCode.KEY_S;
}
