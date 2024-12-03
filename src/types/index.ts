import { Timestamp } from "firebase/firestore";

export type Message = {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Timestamp;
};

export type Chat = {
  id: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  shared: boolean;
  messages: Message[];
  createdAt: Timestamp;
};
