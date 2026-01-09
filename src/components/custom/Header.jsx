import React, { useEffect, useState } from "react";
import { Button } from "../ui/button.jsx";
import { FcGoogle } from "react-icons/fc";
import { IoMenu } from "react-icons/io5";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [openDialog, setOpenDialog] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log("Google login error", error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: { Authorization: `Bearer ${tokenInfo?.access_token}` },
        }
      )
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        window.location.reload();
      })
      .catch(() => toast.error("Failed to get user profile"));
  };

  useEffect(() => {
    const handleUserUpdate = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("user-updated", handleUserUpdate);
    return () => window.removeEventListener("user-updated", handleUserUpdate);
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="font-semibold text-lg tracking-tight">
          <span className="text-orange-500">Tour</span>BotAI
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <a href="/create-trip">
                  <Button className="rounded-full px-5">+ Create Trip</Button>
                </a>

                <a href="/my-trips">
                  <Button
                    variant="ghost"
                    className="rounded-full text-gray-700 hover:bg-slate-100"
                  >
                    My Trips
                  </Button>
                </a>

                <Popover>
                  <PopoverTrigger asChild>
                    <img
                      src={user?.picture}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full object-cover cursor-pointer border border-slate-200 hover:ring-2 hover:ring-slate-300 transition"
                    />
                  </PopoverTrigger>

                  <PopoverContent className="w-40 p-2">
                    <h2
                      className="text-sm text-red-500 cursor-pointer hover:bg-slate-100 px-2 py-2 rounded-md"
                      onClick={() => {
                        googleLogout();
                        localStorage.clear();
                        window.location.reload();
                      }}
                    >
                      Logout
                    </h2>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Mobile */}
              <div className="md:hidden">
                <Popover>
                  <PopoverTrigger>
                    <IoMenu className="h-7 w-7 text-slate-700" />
                  </PopoverTrigger>

                  <PopoverContent className="w-44 p-2">
                    <div className="flex flex-col gap-1">
                      <a
                        href="/create-trip"
                        className="px-2 py-2 rounded-md hover:bg-slate-100"
                      >
                        Create Trip
                      </a>
                      <a
                        href="/my-trips"
                        className="px-2 py-2 rounded-md hover:bg-slate-100"
                      >
                        My Trips
                      </a>
                      <h2
                        className="cursor-pointer px-2 py-2 rounded-md hover:bg-slate-100 text-red-500"
                        onClick={() => {
                          googleLogout();
                          localStorage.clear();
                          window.location.reload();
                        }}
                      >
                        Logout
                      </h2>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </>
          ) : (
            <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
          )}
        </div>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Sign in with Google</DialogTitle>

            <DialogDescription asChild>
              <div>
                <h2 className="font-bold text-lg mt-6">Sign in with Google</h2>
                <p className="text-sm text-gray-600">
                  Secure authentication using Google.
                </p>

                <Button
                  className="mt-6 w-full flex gap-3 items-center justify-center"
                  onClick={login}
                >
                  <FcGoogle className="h-6 w-6" />
                  Continue with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
