import { gql } from '@apollo/client';


// export const CREATE_LOBBY = gql`
//   mutation createLobby($name: String!) {
//     createLobby(name: $name) {
//       id
//       name
//     }
//   }
// `;
export const CREATE_LOBBY = gql`
  mutation createLobby($name: String!, $emoji: String) {
    createLobby(name: $name, emoji: $emoji) {
      id
      name
    }
  }
`;


export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        loginTimestamp
        loginCount
      }
    }
  }
`;


export const CREATE_USER = gql`
  mutation createUser($email: String!, $username: String!, $password: String!) {
    createUser(email: $email, username: $username, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;


export const USER_JOIN_LOBBY = gql`
  mutation userJoinLobby($name: String!) {
    userJoinLobby(name: $name) {
      id
      name
      users {
        _id
        username
      }
    }
  }
`;


export const CREATE_MESSAGE = gql`
    mutation createMessage($lobbyId: String!, $text: String!) {
        createMessage(lobbyId: $lobbyId, text: $text) {
            id
            text
            username
            user_id
            lobby {
                id
                name
            }
            createdAt
        }
    }
`;


export const CREATE_GOOD_MESSAGE = gql`
    mutation createGoodMessage($lobbyId: String!, $text: String!,$username:String!) {
        createGoodMessage(lobbyId: $lobbyId, text: $text, username: $username) {
            id
            text
            username
            user_id
            lobby {
                id
                name
            }
            createdAt
        }
    }
`;


export const USER_DISCONNECT_LOBBY = gql`
  mutation userDisconnectLobby($name: String!) {
    userDisconnectLobby(name: $name) {
      id
      name
      users {
        _id
        username
      }
    }
  }
`;
