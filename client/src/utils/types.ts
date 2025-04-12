//https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
export type Lobbies = Lobby[]

export type Lobby = {
  id: string,
  name: string,
  createdAt: any,
  emoji?: string,
  users?: User[],

  mine?: boolean, //style purposes
}

//using it just for the lobby interface
export type User = {
  _id: string,
  name: string,
  email: string
}


export type Maybe<T> = T | undefined | null;












