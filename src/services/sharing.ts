import { nanoid } from 'nanoid';
import { Message } from '../types/index';
import { SharedChat, ShareError } from '../types/sharing';

const SHARED_CHATS_KEY = 'healthchat_shared_chats';

class SharingService {
  private getSharedChats(): Record<string, SharedChat> {
    const data = localStorage.getItem(SHARED_CHATS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveSharedChats(chats: Record<string, SharedChat>): void {
    localStorage.setItem(SHARED_CHATS_KEY, JSON.stringify(chats));
  }

  async shareChat(messages: Message[], userId: string): Promise<string> {
    try {
      if (!userId) {
        throw new Error('User must be logged in to share chats');
      }

      const shareId = nanoid(10);
      const sharedChats = this.getSharedChats();

      const sharedChat: SharedChat = {
        id: shareId,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        createdAt: new Date().toISOString(),
        createdBy: userId
      };

      sharedChats[shareId] = sharedChat;
      this.saveSharedChats(sharedChats);

      return shareId;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSharedChat(shareId: string): Promise<Message[]> {
    try {
      const sharedChats = this.getSharedChats();
      const sharedChat = sharedChats[shareId];

      if (!sharedChat) {
        throw new Error('Shared chat not found');
      }

      return sharedChat.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ShareError {
    if (error instanceof Error) {
      return {
        code: 'share/unknown',
        message: error.message
      };
    }
    return {
      code: 'share/unknown',
      message: 'An unknown error occurred'
    };
  }
}

export const sharing = new SharingService();