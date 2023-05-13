import { SpriteFrame, resources } from "cc";
import Singleton from "../Base/Singleton";

export class ResourceManager extends Singleton {
  static get Instance() {
      return super.GetInstance<ResourceManager>()
  }
  loadDirSpriteFrame(path:string,type:typeof SpriteFrame = SpriteFrame){
    return new Promise<SpriteFrame[]>((resolve,reject)=>{
      resources.loadDir(path,type,function(err,assets){
        if(err){
          reject(err)
          return
        }
        resolve(assets)
      })
    })
  }
}
