import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UserPopover from "./UserMenu";
import { QUERY_GET_LOBBY_BY_ID } from "@/graphql_utils/queries";
import { useQuery } from "@apollo/client";


export const Header = () => {
  const { user } = useAuth();
  if (!user) return;

  const location = useLocation();
  const path = location.pathname;

  const isLobby = path.includes("/lobby/");
  const isHome = path === "/";
  const isProfile = path.includes("/profile/");


  // const { id: lobbyId } = useParams(); could not get it this way 
  const match = path.match(/\/lobby\/([^/]+)/);
  const lobbyId = match?.[1];

  const { data } = useQuery(QUERY_GET_LOBBY_BY_ID, {
    variables: { lobbyId },
  });


  return (
    <header className="header">
      <div className="section-container flex gap-4 items-center px-4 h-full">


        {/* <Link className="" to="/">Home</Link> */}

        <div className="flex-grow">
          {isHome && (
            <>
              {/* <img src="/logo.svg" alt="logo" className="" /> */}
              <h1 className="font-bold text-2xl">Welcome, {user.username}</h1>
            </>
          )}


          {isLobby && data?.lobbyById && (
            <h1 className="text-xl font-semibold ">
              <span className="emoji" aria-hidden>{data.lobbyById.emoji}</span>
              {data.lobbyById.name}
            </h1>
          )}

          {isProfile && (
            <h1 className="text-xl font-semibold">Your profile</h1>
          )}
        </div>


        {user ? (
          <>
            <UserPopover />
          </>
        ) : (
          <Link className="" to="/login">Login</Link>
        )}

      </div>
    </header>
  );
};
