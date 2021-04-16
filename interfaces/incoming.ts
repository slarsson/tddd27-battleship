import { MessageType } from './index';

export interface IncomingMessage {
  type: MessageType,
  token: string;
}

// incoming
export interface Connect extends IncomingMessage {}

export interface Status extends IncomingMessage {}

export interface Shoot extends IncomingMessage {
  index: number;
}

export const validateMessage = (msg: any): boolean => {
  if (msg.type === undefined || typeof msg.type !== 'string') return false;
  if (msg.token === undefined || typeof msg.token !== 'string') return false;

  switch (msg.type) {
    case MessageType.Connect:
      return true;

    case MessageType.Status:
      return true;

    case MessageType.Shoot:
      return !(msg.index === undefined || typeof msg.index !== 'number');
  
    default:
      return false;
  }
}
