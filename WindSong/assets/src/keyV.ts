import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyV')
export class KeyV extends Key {
  key = KeyCode.KEY_V;
}
