import { _decorator, KeyCode } from 'cc';
import { Key } from './playKeySounds';
const { ccclass } = _decorator;

@ccclass('keyE')
export class KeyE extends Key {
  key = KeyCode.KEY_E;
}
