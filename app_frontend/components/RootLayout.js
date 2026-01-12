import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getBaseUrl, getMediaUrl } from "@/baseURLS";
import Logo from "@/public/Logo.png";
import Banner from "./Banner";

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  const clearUserData = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setUserProfile(null);
  };

  // Check authentication on component mount and token changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          clearUserData();
          setLoading(false);
          setAuthChecked(true);
          return;
        }

        const response = await axios.get(`${getBaseUrl()}/api/auth/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.authenticated) {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));

          // Fetch user profile
          try {
            const profileResponse = await axios.get(
              `${getBaseUrl()}/api/profile/user/${response.data.user_id}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setUserProfile(profileResponse.data);
          } catch (profileError) {
            console.error("Failed to fetch user profile:", profileError);
          }
        } else {
          clearUserData();
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        if (error.response?.status === 401) {
          clearUserData();
        }
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();

    // Set up interval to check token validity every 5 minutes
    const intervalId = setInterval(checkAuth, 5 * 60 * 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    clearUserData();
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Menu Section */}
      <aside className="w-1/6 bg-[#F4EBD0] p-6 flex flex-col items-center shadow-lg">
        <div className="text-2xl font-bold mb-8">
          <img
            src={Logo.src || "/logo.png"}
            alt="Logo"
            className="h-[180px] w-auto"
          />
        </div>
        <nav className="space-y-6 w-full">
          <Link
            href="/"
            replace
            className="block px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-[#E07B50] hover:text-white hover:shadow-md transform hover:-translate-y-0.5"
          >
            🏠 Home
          </Link>
          <Link
            href="/recipe"
            replace
            className="block px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-[#E07B50] hover:text-white hover:shadow-md transform hover:-translate-y-0.5"
          >
            🍳 Recipes
          </Link>
          <Link
            href="/tutorial"
            replace
            className="block px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-[#E07B50] hover:text-white hover:shadow-md transform hover:-translate-y-0.5"
          >
            📚 Learn
          </Link>
          <Link
            href="/community"
            replace
            className="block px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-[#E07B50] hover:text-white hover:shadow-md transform hover:-translate-y-0.5"
          >
            👥 Community
          </Link>
          <Link
            href="/about"
            replace
            className="block px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-[#E07B50] hover:text-white hover:shadow-md transform hover:-translate-y-0.5"
          >
            ℹ️ About
          </Link>
        </nav>
      </aside>

      {/* Main Content Section */}
      <main className="w-4/6 p-6 overflow-y-auto bg-gray-50">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 text-gray-700 bg-white rounded-lg shadow hover:bg-gray-100 transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>
        <Banner />
        <div className="mt-4">{children}</div>
      </main>

      {/* Right User Info Section */}
      <aside className="w-1/6 bg-[#F4EBD0] p-4 flex flex-col items-center shadow-lg">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>
            <div className="h-4 w-24 bg-gray-300 mt-3 rounded"></div>
          </div>
        ) : user && authChecked ? (
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${user.user_id}`}
              className="flex flex-col items-center group"
            >
              {userProfile?.profile_image ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#6B8E23] transition-transform transform group-hover:scale-105">
                  <img
                    src={getMediaUrl(userProfile.profile_image)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#6B8E23] text-white flex items-center justify-center font-bold text-xl border-2 border-[#6B8E23] transition-transform transform group-hover:scale-105">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className="text-base mt-3 font-medium">{user.username}</div>
            </Link>
            <div className="mt-6 space-y-3 w-full">
              <Link
                href={`/profile/${user.user_id}`}
                className="block text-center px-4 py-2 rounded-lg bg-[#6B8E23] text-white hover:bg-[#557A1F] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-center px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-xl transition-transform transform group-hover:scale-105">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="text-base mt-3 font-medium text-gray-600">
                Guest
              </div>
            </div>
            <div className="mt-6 space-y-3 w-full">
              <Link
                href="/login"
                className="block text-center px-4 py-2 rounded-lg bg-[#6B8E23] text-white hover:bg-[#557A1F] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-center px-4 py-2 rounded-lg bg-[#E07B50] text-white hover:bg-[#C66B40] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
