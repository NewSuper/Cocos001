import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyW')
export class KeyW extends Key {
  key = KeyCode.KEY_W;
}
