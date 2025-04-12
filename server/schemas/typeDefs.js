const { gql } = require('apollo-server-express');

/* 
MongoDB automatically adds a field called _id for each document, which is a unique identifier. This is the default identifier for MongoDB documents.
*/

const typeDefs = gql`
    type User {
        _id: ID
        email: String
        username: String
        password: String
        loginTimestamp: String
        loginCount: Int
        favorites: [Lobby]
    }

    type Lobby {
        id: ID
        name: String
        emoji: String
        users: [User]
        createdAt: String!
    }

    type Message {
        id: ID!
        text: String!
        username: String!
        user_id: String!
        lobby: Lobby!
        createdAt: String!
    }

    type Auth {
        token: ID
        user: User
    }

    type Query {
        user(id: String!): User
        lobby: Lobby
        allUsers: [User]
        allLobbies: [Lobby]
        messagesByLobbyName(lobbyName: String!): [Message]
        messagesByLobbyId(lobbyId: String!): [Message]
        lobbyById(lobbyId: String!): Lobby
    }

    type Mutation {
        createUser(email: String!, username: String!, password: String!): Auth
        createLobby(name: String!, emoji: String): Lobby
        createMessage(lobbyId: String!, text: String!): Message!
        createGoodMessage(lobbyId: String!, text: String!,username:String!): Message!
        login(email: String!, password: String!): Auth
        userJoinLobby(name: String!): Lobby
    }
    
    type Subscription {
        messageAdded(lobby: String!): Message!
    }
`;

module.exports = typeDefs;
