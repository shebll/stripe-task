import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { sharing } from '../services/sharing';
import { ChatMessage } from '../components/ChatMessage';
import { Message } from '../types';

const SharedChat: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSharedChat = async () => {
      if (!shareId) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      try {
        const sharedMessages = await sharing.getSharedChat(shareId);
        setMessages(sharedMessages);
      } catch (error: any) {
        setError(error.message || 'Failed to load shared chat');
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedChat();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading shared chat...</span>
        </div>
      </div>
    );
  }

  if (error || !messages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Shared chat not found'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Chat</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Chat</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6 space-y-6">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default SharedChat;