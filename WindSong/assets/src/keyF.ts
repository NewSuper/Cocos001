import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyF')
export class KeyF extends Key {
  key = KeyCode.KEY_F;
}
