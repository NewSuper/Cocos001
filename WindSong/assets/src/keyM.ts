import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyM')
export class KeyM extends Key {
  key = KeyCode.KEY_M;
}
