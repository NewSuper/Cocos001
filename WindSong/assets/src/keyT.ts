import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyT')
export class KeyT extends Key {
  key = KeyCode.KEY_T;
}
