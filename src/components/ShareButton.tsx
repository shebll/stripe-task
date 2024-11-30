import React, { useState } from 'react';
import { Share2, Check, Copy, X } from 'lucide-react';
import { sharing } from '../services/sharing';
import { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ShareButtonProps {
  messages: Message[];
}

export const ShareButton: React.FC<ShareButtonProps> = ({ messages }) => {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    if (!user) {
      setError('Please log in to share chats');
      return;
    }

    setIsSharing(true);
    setError(null);
    
    try {
      const shareId = await sharing.shareChat(messages, user.id);
      const url = `${window.location.origin}/shared/${shareId}`;
      setShareUrl(url);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setShareUrl(null);
    setError(null);
  };

  if (error) {
    return (
      <div className="fixed bottom-20 right-4 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="text-red-600 text-sm">{error}</div>
          <button onClick={handleClose} className="text-red-500 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (shareUrl) {
    return (
      <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
          />
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleShare}
      disabled={isSharing || messages.length === 0}
      className="fixed bottom-20 right-4 bg-blue-900 text-white p-3 rounded-full shadow-lg
                hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50
                disabled:cursor-not-allowed"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
};