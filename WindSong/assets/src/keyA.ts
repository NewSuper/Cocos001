import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyA')
export class KeyA extends Key {
  key = KeyCode.KEY_A;
}
