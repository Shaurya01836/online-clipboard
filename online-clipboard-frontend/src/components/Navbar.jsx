import { Link, useNavigate } from "react-router-dom";
import { Terminal, LogOut, UserCircle, Globe, BookOpen } from "lucide-react";
import { useAuth, useClerk } from '@clerk/clerk-react';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const isAuthenticated = Boolean(user || isSignedIn);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Clerk sign out error", err);
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("clerk_token");
    navigate("/");
  };

  return (
    <nav className="border-b border-[#141416] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-40 font-sans">
      {/* Responsive Padding: px-4 on mobile */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
           <span className="text-lg font-sans text-white leading-none">
              Online Clipboard
            </span>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            to="/about"
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Our Story</span>
          </Link>

          <Link
            to="/community"
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Community</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 rounded-full border border-[#222] bg-[#111] px-2 py-1.5 text-sm text-gray-300 hover:border-[#444] hover:text-white transition-colors"
                title="Dashboard"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user?.username || "Profile"}
                    className="w-8 h-8 rounded-full object-cover border border-[#2a2a2a]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2a2a2a] flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <span className="hidden md:inline max-w-[140px] truncate pr-1">{user?.username || "Account"}</span>
              </Link>

              <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-[#141416]">
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors bg-[#1A1A1A] hover:bg-[#222] border border-[#333] px-3 py-1.5 rounded-full"
            >
              <UserCircle className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}