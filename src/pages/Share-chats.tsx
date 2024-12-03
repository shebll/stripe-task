import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Chat } from "../types";
import {
  Loader,
  MessageSquare,
  PieChart,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  User,
} from "lucide-react";

export function SharedChatsList() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    totalChats: 0,
    totalUpvotes: 0,
    totalDownvotes: 0,
    upvotePercentage: 0,
  });

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const chatsQuery = query(
          collection(db, "ChatsCollection"),
          where("shared", "==", true),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(chatsQuery);
        const sharedChats = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId as string,
            messages: data.messages,
            createdAt: data.createdAt,
            shared: data.shared,
            upvotes: data.upvotes || 0,
            downvotes: data.downvotes || 0,
          } as Chat;
        });
        // Calculate statistics
        const totalChats = sharedChats.length;
        const totalUpvotes = sharedChats.reduce(
          (sum, chat) => sum + (chat.upvotes || 0),
          0
        );
        const totalDownvotes = sharedChats.reduce(
          (sum, chat) => sum + (chat.downvotes || 0),
          0
        );
        const upvotePercentage =
          totalChats > 0
            ? ((totalUpvotes / (totalUpvotes + totalDownvotes)) * 100).toFixed(
                2
              )
            : 0;

        setStatistics({
          totalChats,
          totalUpvotes,
          totalDownvotes,
          upvotePercentage: Number(upvotePercentage),
        });

        setChats(sharedChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl px-4 py-3 mx-auto sm:py-4">
      <h1
        className={`mb-4 text-2xl font-semibold text-center ${
          statistics.upvotePercentage >= 90 && "text-yellow-500"
        }`}
      >
        Shared Chats
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Click on a chat to see its messages and vote on them. and share it!
      </p>
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        {/* Statistics Cards */}
        <div className="p-6 transition-all transform bg-white border rounded-lg shadow-md ">
          <div className="flex items-center justify-between mb-4">
            <PieChart className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-gray-700">
              {statistics.totalChats}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">
            Total Shared Chats
          </h3>
        </div>

        <div className="p-6 transition-all transform bg-white border rounded-lg shadow-md ">
          <div className="flex items-center justify-between mb-4">
            <ThumbsUp className="w-8 h-8 text-green-500" />
            <span className="text-xl font-bold text-green-700">
              {statistics.totalUpvotes}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Upvotes</h3>
        </div>

        <div className="p-6 transition-all transform bg-white border rounded-lg shadow-md ">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold text-purple-700">
              {statistics.upvotePercentage}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">
            Upvote Percentage
          </h3>
        </div>
      </div>
      {chats.length > 0 ? (
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="flex items-center justify-between p-4 transition-all bg-white border rounded-lg shadow hover:shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium text-gray-800">
                  Chat by User {user?.email}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-600">
                  <MessageSquare className="w-4 h-4" />
                  <span>{chat.messages.length} messages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{chat.upvotes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-red-600">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{chat.downvotes}</span>
                  </div>
                </div>
              </div>
              <a
                href={`/shared/${chat.id}`}
                className="text-blue-600 hover:underline"
              >
                View Chat
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No shared chats found.</p>
      )}
    </div>
  );
}
