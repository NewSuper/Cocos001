export abstract class BaseEvent{
    static get Type(){
      return this.name
    }
}
