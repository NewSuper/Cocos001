import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyC')
export class KeyC extends Key {
  key = KeyCode.KEY_C;
}
