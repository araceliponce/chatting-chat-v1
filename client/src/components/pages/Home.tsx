import { useQuery } from "@apollo/client";

import { QUERY_ALL_LOBBIES } from "@/graphql_utils/queries";
import { useAuth } from "@/context/AuthContext";
import { Stroll } from "./Stroll";
import { HomeEmpty } from "./HomeEmpty";
import { useEffect, useState } from "react";


export default function NewHome() {

  const { user } = useAuth();
  if (!user) {
    return (
      <HomeEmpty />
    );
  }


  const { loading, data } = useQuery(QUERY_ALL_LOBBIES, {
    fetchPolicy: "no-cache",
    // fetchPolicy: "cache-first", // usa cache si ya existe
    skip: !user // evita la query si no está logueado
  })

  const lobbyList = data?.allLobbies || [];
  // console.log({ data })

  const SORT_OPTIONS = {
    POPULAR: 'popular',
    OLDEST: 'oldest',
    MINE: 'mine',
  };

  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem('lobby-sort') || SORT_OPTIONS.POPULAR;
  });

  useEffect(() => {
    localStorage.setItem('lobby-sort', sortBy);
  }, [sortBy]);

  const filteredSortedLobbies = [...lobbyList]
    .filter((lobby) => {
      if (sortBy === SORT_OPTIONS.MINE) {
        return lobby.users.some((u: any) => u._id === user?._id);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === SORT_OPTIONS.POPULAR) {
        return b.users.length - a.users.length;
      }
      if (sortBy === SORT_OPTIONS.OLDEST) {
        return parseInt(a.createdAt) - parseInt(b.createdAt);
      }
      return 0;
    })
    .map((lobby) => {
      //also adding a mine:true
      const isMine = lobby.users.some((u: any) => u._id === user?._id);
      return {
        ...lobby,
        ...(isMine && { mine: true })
      };
    });





  return (
    <main>

      <div className="absolute top-[4rem] left-0 right-0 z-[1] text-xs">
        <section className="section-container px-4 *:min-w-[20ch]">

          <label htmlFor="sort-select" className=" sr-only">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="btn btn--input rounded-sm"
          >
            <option value="default">{loading ? 'Cargando...' : 'Sorted by date'}</option>
            <option value={SORT_OPTIONS.POPULAR}>Sorted by popularity</option>
            {/* <option value={SORT_OPTIONS.OLDEST}>Date</option> */}
            <option value={SORT_OPTIONS.MINE}>I am member</option>
          </select>



        </section>
      </div>

      <Stroll items={filteredSortedLobbies} />


    </main>
  );
}
