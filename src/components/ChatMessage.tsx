import React from "react";
import { Stethoscope, User } from "lucide-react";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex items-start space-x-3 max-w-[92%] sm:max-w-[85%] ${
          message.isBot ? "flex-row" : "flex-row-reverse space-x-reverse"
        }`}
      >
        <div
          className={`flex-shrink-0 p-2 sm:p-2.5 rounded-xl ${
            message.isBot
              ? "bg-blue-100 text-blue-900"
              : "bg-blue-900 text-white"
          }`}
        >
          {message.isBot ? (
            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </div>
        <div
          className={`relative p-4 sm:p-5 rounded-2xl shadow-sm ${
            message.isBot ? "bg-white text-gray-800" : "bg-blue-900 text-white"
          }`}
        >
          <p className="text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
          <span
            className={`block text-[11px] sm:text-xs mt-2 ${
              message.isBot ? "text-gray-400" : "text-blue-200"
            }`}
          >
            {message.timestamp.toDate().toLocaleDateString()}
            {" / "}
            {message.timestamp.toDate().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};
