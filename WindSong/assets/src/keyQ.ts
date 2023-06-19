import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyQ')
export class KeyQ extends Key {
  key = KeyCode.KEY_Q;
}
