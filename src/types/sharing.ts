import { Message } from './index';

export interface SharedChat {
  id: string;
  messages: Message[];
  createdAt: string;
  createdBy: string;
}

export interface ShareError {
  code: string;
  message: string;
}