import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import { clerkUpsert, setAuthToken, wakeUpServer } from "./services/api";
import "./services/OfflineSync"; // Initialize offline listeners
import Community from "./pages/Community";
import About from "./pages/About";
import ServerWakingUp from "./components/ServerWakingUp"; 
import { useAuth, useUser } from "@clerk/clerk-react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [serverReady, setServerReady] = useState(false);
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth();
  const { isLoaded: userLoaded, user: clerkUser } = useUser();

  useEffect(() => {
    const initializeServer = async () => {
      try {
        await wakeUpServer(); 
        setServerReady(true);
      } catch (err) {
        setServerReady(true);
        console.log(err)
      }
    };

    initializeServer();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const syncClerkUser = async () => {
      if (!authLoaded || !userLoaded) return;

      if (!isSignedIn || !clerkUser) {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("clerk_token");
        return;
      }

      try {
        const token = await getToken();
        if (cancelled) return;

        setAuthToken(token);
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || clerkUser.primaryEmailAddress?.emailAddress || null;
        const avatarUrl = clerkUser.imageUrl || null;
        const fallbackUsername = email ? email.split("@")[0] : clerkUser.id;
        const backendUser = await clerkUpsert({
          username: clerkUser.username || fallbackUsername,
          email,
          avatarUrl,
        });
        if (cancelled) return;

        setUser({ ...backendUser, email: backendUser.email || email, avatarUrl: backendUser.avatarUrl || avatarUrl });
        localStorage.setItem("user", JSON.stringify({ ...backendUser, email: backendUser.email || email, avatarUrl: backendUser.avatarUrl || avatarUrl }));
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to sync Clerk user, falling back to local session", err);
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || clerkUser.primaryEmailAddress?.emailAddress || null;
        const fallbackUser = {
          username: email ? email.split("@")[0] : clerkUser.id,
          email,
          avatarUrl: clerkUser.imageUrl || null,
          id: clerkUser.id,
        };
        setUser(fallbackUser);
        localStorage.setItem("user", JSON.stringify(fallbackUser));
      }
    };

    syncClerkUser();

    return () => {
      cancelled = true;
    };
  }, [authLoaded, userLoaded, isSignedIn, clerkUser?.id, getToken]);


  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster theme="dark" position="bottom-right" />

      <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-purple-500 selection:text-white">
        <Navbar user={user} setUser={setUser} />

        {/* Render the Status Widget here, passing the status */}
        <ServerWakingUp isReady={serverReady} />

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={!user ? <Auth setUser={setUser} /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />
            }
          />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;