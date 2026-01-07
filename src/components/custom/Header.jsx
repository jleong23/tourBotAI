import React, { useEffect, useState } from "react";
import { Button } from "../ui/button.jsx";
import { FcGoogle } from "react-icons/fc";
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
  const user = JSON.parse(localStorage.getItem("user"));
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
    console.log(user);
  });
  return (
    <div className="w-full p-3 shadow-sm flex justify-between items-center px-5">
      <h1 className="font-semibold">
        <span className="text-orange-500">Tour</span>BotAI
      </h1>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
              <Button
                variant="outline"
                className="!rounded-full !bg-slate-100 border-slate-500"
              >
                + Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button
                variant="outline"
                className="!rounded-full !bg-slate-100 border-slate-500"
              >
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  className="h-[40px] w-[40px] rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer"
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
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">Sign in with Google</DialogTitle>
              <DialogDescription asChild>
                <div>
                  <h2 className="font-bold text-lg mt-7">
                    Sign in With Google
                  </h2>
                  <p>Sign in to the App with Google Authentication securely.</p>
                  <Button
                    className="mt-5 w-full flex gap-4 items-center justify-center bg-red-600 text-white hover:bg-red-700"
                    onClick={login}
                  >
                    <FcGoogle className="h-7 w-7" /> Sign in with Google
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Header;
