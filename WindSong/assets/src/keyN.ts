import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyN')
export class KeyN extends Key {
  key = KeyCode.KEY_N;
}
