import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from "@/context/AuthContext";
import { PopoverClose } from "@radix-ui/react-popover";
// import { PopoverClose } from "@radix-ui/react-popover";
// import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const location = useLocation();
  const path = location.pathname;

  // const isLobby = path.includes("/lobby/");
  const isHome = path === "/";
  // const isProfile = path.includes("/profile/");

  return (
    <div className="text-start">
      <Popover>
        <PopoverTrigger asChild>
          <button className="btn--avatar"></button>
        </PopoverTrigger>
        <PopoverContent>

          <div className="grid ">
            {!isHome && (
              <PopoverClose asChild>
                <Link className="btn--menu" to={`/`}>
                  Home
                </Link>
              </PopoverClose>
            )}
            <PopoverClose asChild>
              <Link className="btn--menu" to={`/profile/${user._id}`}>
                My profile
              </Link>
            </PopoverClose>
            <div className="pt-3">
              <button className="btn btn--secondary" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

