import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import Levels from '../../Level';
import { test } from '../test';
import { TileManager } from './TileManager';
import { creatUINode, randomByRange } from '../Utils';
import { DataManager } from '../Runtime/DataManager';
import { ResourceManager } from '../Runtime/ResourceManager';

@ccclass('TileMapManager')
export class TileMapManager extends Component {
    async init(){
      const {mapInfo}=DataManager.Instance
      DataManager.Instance.tileInfo=[]
      const spriteFrames=await ResourceManager.Instance.loadDirSpriteFrame('texture/tile/tile')
    for (let i = 0; i < mapInfo.length; i++) {
      //每一行的数据
      const colum = mapInfo[i];
      DataManager.Instance.tileInfo[i]=[]
      for (let j = 0; j < colum.length; j++) {
        const item = colum[j];
        //绘制每个图片
        if(item.src===null||item.type===null){
          continue
        }
        const node=creatUINode("node")
        randomByRange
        let number=item.src
        if((number===1||number===5||number===9)&&(i%2===0 &&j%2===0)){
          number+=randomByRange(0,4)
        }
        const imgSrc=`tile (${number})`
        const spriteFrame=spriteFrames.find(v=>v.name===imgSrc)||spriteFrames[0]
        const type=item.type
        const tileManager= node.addComponent(TileManager)
        DataManager.Instance.tileInfo[i][j]=tileManager
        tileManager.init(type,spriteFrame,i,j)
        node.setParent(this.node)

      }

    }
    }

  }

