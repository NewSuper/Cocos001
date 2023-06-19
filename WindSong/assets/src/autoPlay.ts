import {
  _decorator,
  error,
  KeyCode,
  Component,
  input,
  Input,
  EventKeyboard,
} from 'cc';
import { showTip } from './Tip';
const { ccclass } = _decorator;

export const keyMap = new Map();
const keyCodeMap = new Map([
  ['q', KeyCode.KEY_Q],
  ['w', KeyCode.KEY_W],
  ['e', KeyCode.KEY_E],
  ['r', KeyCode.KEY_R],
  ['t', KeyCode.KEY_T],
  ['y', KeyCode.KEY_Y],
  ['u', KeyCode.KEY_U],
  ['a', KeyCode.KEY_A],
  ['s', KeyCode.KEY_S],
  ['d', KeyCode.KEY_D],
  ['f', KeyCode.KEY_F],
  ['g', KeyCode.KEY_G],
  ['h', KeyCode.KEY_H],
  ['j', KeyCode.KEY_J],
  ['z', KeyCode.KEY_Z],
  ['x', KeyCode.KEY_X],
  ['c', KeyCode.KEY_C],
  ['v', KeyCode.KEY_V],
  ['b', KeyCode.KEY_B],
  ['n', KeyCode.KEY_N],
  ['m', KeyCode.KEY_M],
]);

export let playing = false;
export let delay = 250;
let speed = 1.0;
let keyMapStr = `Q W E Q W T T
E Y YYY T T E
Q QQYY T E T
WW EEWQEW`;

async function keyPress(keys: Array<KeyCode | string>) {
  let pressTime = 250;
  let delayTime = 0;
  const trueDelay = delay * speed;
  if (trueDelay !== pressTime) {
    trueDelay > pressTime
      ? (delayTime = trueDelay - pressTime)
      : (pressTime = trueDelay);
  }

  switch (keys[0]) {
    case '+':
      speed *= 0.5;
      break;
    case '-':
      speed *= 2;
      break;
    case ' ':
      await asyncSleep(pressTime + delayTime);
      break;
    default: {
      // log(`trueDelay:${trueDelay}, pressTime: ${pressTime}, delayTime:${delayTime}, speed:${speed}`)
      const keysObj = keys.map((i) => keyMap.get(i));
      for (const k of keysObj) {
        k.down();
      }
      await asyncSleep(pressTime);
      for (const k of keysObj) {
        k.up();
      }
      await asyncSleep(delayTime);
      break;
    }
  }
}

function asyncSleep(time: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

function parseKeys(keys: string) {
  const keyList = [];
  const tmpLi = [];
  let i = 0;
  let together = false;

  // 统一换行符
  keys = keys.replace(/\r\n/g, '\n');
  keys = keys.replace(/\r/g, '\n');

  for (const orgKey of keys) {
    i++;
    const k = orgKey.toLowerCase();
    if (k === '(') {
      // 同时弹奏开始
      if (!together) {
        together = true;
      } else {
        throw new SyntaxError(`多余的 "${orgKey}" 在第 ${i} 个字符`);
      }
    } else if (k === ')') {
      // 同时弹奏结束
      if (together) {
        together = false;
      } else {
        throw new SyntaxError(`多余的 "${orgKey}" 在第 ${i} 个字符`);
      }
    } else if (keyCodeMap.has(k)) {
      // 已有键
      tmpLi.push(keyCodeMap.get(k));
    } else if (['+', '-', ' '].indexOf(k) !== -1) {
      // 控制符
      if (!together) {
        tmpLi.push(k);
      } else {
        throw new SyntaxError(`多余的 ${orgKey} 在第 ${i} 个字符`);
      }
    } else if (k === '\n') {
      // 换行符双次停顿
      if (!together) {
        keyList.push([' '], [' ']);
      } else {
        throw new SyntaxError(`多余的 换行符 在第 ${i} 个字符`);
      }
      continue;
    } else {
      throw new SyntaxError(
        `无法解析第 ${i} 个字符 "${orgKey}"(${orgKey.codePointAt(0)})`
      );
    }

    if (!together) {
      keyList.push(tmpLi.slice()); // 列表为引用，需要复制数组，不然出bug
      tmpLi.length = 0;
    }
  }
  return keyList;
}

async function playKeyMap() {
  let p;
  try {
    p = parseKeys(keyMapStr);
  } catch (e) {
    alert(`解析乐谱出错：${e.message}`);
    return;
  }

  speed = 1.0;
  playing = true;
  for (const k of p) {
    if (playing) {
      await keyPress(k);
    } else {
      break;
    }
  }
  playing = false;
}

export function setDelay() {
  if (!playing) {
    const ret = prompt('请输入延时数值(ms)', delay.toString());
    if (ret) {
      const parsed = Number.parseInt(ret);
      if (!Number.isNaN(parsed) && parsed > 0) {
        delay = parsed;
        showTip(`延迟已设置为 ${parsed}ms`);
      } else {
        alert(`无效数值"${parsed}"`);
      }
    }
  } else {
    showTip('<color=#ff0000>正在自动弹奏，无法设置延迟</color>');
  }
}

export async function playKeys() {
  if (!playing) {
    const ret = prompt(
      '请键入曲谱，多行请直接复制粘贴（懒）\n' +
        '曲谱语法：\n' +
        '- 输入对应的字母\n' +
        '- 单次停顿：空格\n' +
        '- 双次停顿：换行\n' +
        '- 和弦（在半角括号中输入）：(gggg)\n' +
        '- 双倍速："+"（加号）\n' +
        '- 半倍速："-"（减号）',
      keyMapStr
    );
    if (ret) {
      keyMapStr = ret;
      await playKeyMap();
    }
  } else {
    playing = false;
    showTip('停止播放');
  }
}

@ccclass('Canvas')
export class Key extends Component {
  start() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.KEY_O:
        playKeys().catch((e) => error(e));
        break;
      case KeyCode.KEY_P:
        setDelay();
        break;
    }
  }
}
