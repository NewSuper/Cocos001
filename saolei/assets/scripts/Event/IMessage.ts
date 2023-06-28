/** 发消息的接口 */
export interface IMessage {
    recvMsg(cmd: number, data: any): void;
}