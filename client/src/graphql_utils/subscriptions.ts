import { gql } from '@apollo/client';

export const MESSAGE_ADDED = gql`
  subscription messageAdded($lobbyName: String!) {
    messageAdded(lobbyName: $lobbyName) {
      id
      text
      username
      user_id
      createdAt
    }
  }
`;
