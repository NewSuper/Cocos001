import { RenderRoot2D, Root, SpriteFrame, director, game, resources } from "cc";
import Singleton from "../Base/Singleton";
import { DrawManager } from "../UI/DrawManager";
import { creatUINode } from "../Utils";

const DEFAULT_DURATION=200
export class FaderManager extends Singleton {
  static get Instance() {
      return super.GetInstance<FaderManager>()
  }

  private _fader:DrawManager=null
  get fader(){
    if(!this._fader){
      const root= creatUINode()
      const fadeNode=creatUINode()
      root.addComponent(RenderRoot2D)
      this._fader=fadeNode.addComponent(DrawManager)
      fadeNode.setParent(root)
      this._fader.init()
      director.addPersistRootNode(root)
    }
    return this._fader
  }
  fadeIn(duration:number=DEFAULT_DURATION){
    return this.fader.fadeIn(duration)
  }
  fadeOut(duration:number=DEFAULT_DURATION){
    return this.fader.fadeOut(duration)
  }
  mask(){
    return this.fader.mask()
  }
}
