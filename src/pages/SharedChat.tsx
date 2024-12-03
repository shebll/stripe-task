import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { ChatMessage } from "../components/ChatMessage";
import { Message } from "../types";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../config/firebase";

const SharedChat: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSharedChat = async () => {
      if (!shareId) {
        setError("Invalid share link");
        setIsLoading(false);
        return;
      }

      try {
        const chatRef = doc(db, "ChatsCollection", shareId);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          setMessages(chatData.messages);
          setUpvotes(chatData.upvotes || 0);
          setDownvotes(chatData.downvotes || 0);

          // Check if user has already voted (you might want to implement this differently)
          const votedKey = `voted_${shareId}`;
          const storedVote = localStorage.getItem(votedKey);
          if (storedVote) {
            setUserVote(storedVote as "upvote" | "downvote");
          }
        } else {
          setError("Chat not found");
        }
      } catch (error: any) {
        setError(error.message || "Failed to load shared chat");
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedChat();
  }, [shareId]);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!shareId) return;

    const votedKey = `voted_${shareId}`;

    try {
      const chatRef = doc(db, "ChatsCollection", shareId);

      // If clicking the same vote, remove the vote
      if (userVote === type) {
        if (type === "upvote") {
          setUpvotes((prev) => Math.max(0, prev - 1));
          await updateDoc(chatRef, { upvotes: increment(-1) });
        } else {
          setDownvotes((prev) => Math.max(0, prev - 1));
          await updateDoc(chatRef, { downvotes: increment(-1) });
        }
        setUserVote(null);
        localStorage.removeItem(votedKey);
        return;
      }

      // If switching votes
      if (userVote) {
        if (userVote === "upvote") {
          setUpvotes((prev) => Math.max(0, prev - 1));
          await updateDoc(chatRef, { upvotes: increment(-1) });
        } else {
          setDownvotes((prev) => Math.max(0, prev - 1));
          await updateDoc(chatRef, { downvotes: increment(-1) });
        }
      }

      // Add new vote
      if (type === "upvote") {
        setUpvotes((prev) => prev + 1);
        await updateDoc(chatRef, { upvotes: increment(1) });
      } else {
        setDownvotes((prev) => prev + 1);
        await updateDoc(chatRef, { downvotes: increment(1) });
      }

      // Store the vote in local storage
      setUserVote(type);
      localStorage.setItem(votedKey, type);
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-gray-600">Loading shared chat...</span>
        </div>
      </div>
    );
  }

  if (error || !messages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-red-600">
            {error || "Shared chat not found"}
          </p>
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
    <main className="max-w-4xl px-4 py-8 mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Chat</span>
        </Link>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">Shared Chat</h1>
            <div className="flex items-center space-x-4">
              <button
                className={`flex items-center space-x-1 
                  ${
                    userVote === "upvote"
                      ? "text-green-600 bg-green-100 rounded-full p-1"
                      : "text-gray-600 hover:text-green-500"
                  }`}
                onClick={() => handleVote("upvote")}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{upvotes}</span>
              </button>
              <button
                className={`flex items-center space-x-1 
                  ${
                    userVote === "downvote"
                      ? "text-red-600 bg-red-100 rounded-full p-1"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                onClick={() => handleVote("downvote")}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>{downvotes}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-300">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SharedChat;
