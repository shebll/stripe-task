import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import CarePlan from "./pages/CarePlan";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProAccount from "./pages/ProAccount";
import PaymentSuccess from "./pages/PaymentSuccess";
import SharedChat from "./pages/SharedChat";
import { Header } from "./components/Header";
import { DailyHealthTip } from "./components/DailyHealthTip";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/AuthGuard";
import { ProGuard } from "./components/ProGuard";
import { SharedChatsList } from "./pages/Share-chats";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="max-w-4xl px-4 py-4 mx-auto">
          <DailyHealthTip />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <Chat />
              </AuthGuard>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/payment-success"
            element={
              <AuthGuard>
                <PaymentSuccess />
              </AuthGuard>
            }
          />
          <Route
            path="/share-chats"
            element={
              <AuthGuard>
                <SharedChatsList />
              </AuthGuard>
            }
          />
          <Route
            path="/pro"
            element={
              <AuthGuard>
                <ProAccount />
              </AuthGuard>
            }
          />
          <Route
            path="/care-plan"
            element={
              <AuthGuard>
                <ProGuard>
                  <CarePlan />
                </ProGuard>
              </AuthGuard>
            }
          />
          <Route path="/shared/:shareId" element={<SharedChat />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
