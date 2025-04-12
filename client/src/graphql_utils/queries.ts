import { gql } from '@apollo/client';


export const QUERY_ALL_LOBBIES = gql`
  query allLobbies {
    allLobbies {
      id
      name
      createdAt
      emoji
      users{
        _id
      }
    }
  }
`;


export const QUERY_SINGLE_USER = gql`
  query user($id: String!) {
    user(id: $id) {
      _id
      username
      email
      loginTimestamp
      loginCount
      favorites {
        id
        name
      }
    }
  }
`;


export const QUERY_MESSAGES_BY_LOBBY_ID = gql`
  query messagesByLobbyId($lobbyId: String!) {
    messagesByLobbyId(lobbyId: $lobbyId) {
      id
      text
      username
      createdAt
      lobby {
        id
        name
      }
    }
  }
`;

// Query to fetch all messages for a specific lobby by its name
export const QUERY_MESSAGES_BY_LOBBY_NAME = gql`
  query messagesByLobbyName($lobbyName: String!) {
    messagesByLobbyName(lobbyName: $lobbyName) {
      id
      text
      username
      createdAt
      lobby {
        id
        name
      }
    }
  }
`;

// Query to fetch a specific lobby by its ID
export const QUERY_GET_LOBBY_BY_ID = gql`
  query lobbyById($lobbyId: String!) {
    lobbyById(lobbyId: $lobbyId) {
      id
      name
      emoji
      users {
        _id
        username
      }
    }
  }
`;
