import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Disclaimer } from '../components/Disclaimer';
import { ChatLimit } from '../components/ChatLimit';
import { ShareButton } from '../components/ShareButton';
import { getAIResponse } from '../services/openai';
import { useAuth } from '../contexts/AuthContext';
import {
  getRemainingMessages,
  incrementMessageCount,
  hasReachedLimit,
} from '../services/chatLimit';

function Chat() {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI health assistant. I can provide general health information and wellness guidance. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState(() => 
    getRemainingMessages(userProfile?.isPro || false)
  );
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setRemainingMessages(getRemainingMessages(userProfile?.isPro || false));
  }, [userProfile?.isPro]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!user) {
      setError('Please log in to send messages');
      return;
    }

    if (hasReachedLimit(userProfile?.isPro || false)) {
      const limitMessage: Message = {
        id: messages.length + 1,
        text: "You've reached your daily message limit. Please upgrade to Pro for unlimited access.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, limitMessage]);
      return;
    }

    setError(null);
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      incrementMessageCount(userProfile?.isPro || false);
      setRemainingMessages(getRemainingMessages(userProfile?.isPro || false));
      
      const aiResponse = await getAIResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: error.message || 'I apologize, but I encountered a technical issue. Please try again later.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] sm:h-auto sm:max-w-4xl mx-auto px-4 py-4 sm:py-6">
      <div className="hidden sm:block">
        <Disclaimer />
      </div>
      {!userProfile?.isPro && remainingMessages < 5 && (
        <ChatLimit remainingMessages={remainingMessages} />
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex-1 flex flex-col bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="block sm:hidden px-4 py-2 border-b border-gray-200">
          <Disclaimer />
        </div>
        <div className="flex-1 overflow-y-auto message-container">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center py-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t border-gray-200">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
      <ShareButton messages={messages} />
    </main>
  );
}

export default Chat;