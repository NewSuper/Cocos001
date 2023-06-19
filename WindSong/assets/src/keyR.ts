import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyR')
export class KeyR extends Key {
  key = KeyCode.KEY_R;
}
