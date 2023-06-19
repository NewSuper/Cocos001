import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyH')
export class KeyH extends Key {
  key = KeyCode.KEY_H;
}
