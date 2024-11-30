import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit} className="glass-effect p-3 sm:p-4">
    <div className="max-w-3xl mx-auto flex space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your health question..."
        className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 
                 rounded-xl text-[15px] sm:text-base
                 text-gray-800 placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="px-4 sm:px-6 bg-blue-900 text-white rounded-xl hover:bg-blue-800 
                 transition-colors duration-200 shadow-sm
                 disabled:opacity-50 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Send className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  </form>
);