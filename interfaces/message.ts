export enum MessageType {
  JOIN,
}

export interface Message {
  type: MessageType,
  token: string;
}

export interface Join extends Message {
  name: string;
  gameId: string;
}

export const validateMessage = (msg: any): MessageType => {
  if (!msg.hasOwnProperty('type') || typeof msg.type !== 'number') throw 'Not a valid message';
  return msg.type;
}
