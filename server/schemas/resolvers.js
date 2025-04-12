const { AuthenticationError } = require("apollo-server-express");
const { User, Lobby, Message } = require("../models");
const { signToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const resolvers = {
    Query: {
        user: async function (_, args) {
            // console.log(args, "ARGS");
            const userData = await User.findById(args.id);
            // console.log(userData);
            return userData;
        },
        lobby: async function (_, args) {
            return await Lobby.findById(args.id);
        },
        allUsers: async function () {
            return await User.find();
        },
        allLobbies: async function () {
            return Lobby.find();
        },
        messagesByLobbyName: async (_, { lobbyName }) => {
            try {
                const messages = await Message.find({ lobby: lobbyName }).exec();
                return messages;
            } catch (error) {
                console.error('Error fetching messages by lobby name:', error);
                throw error;
            }
        },
        messagesByLobbyId: async (_, { lobbyId }) => {
            try {
                const messages = await Message.find({ lobby: lobbyId }).exec();
                return messages;
            } catch (error) {
                console.error('Error fetching messages by lobby ID:', error);
                throw error;
            }
        },
        lobbyById: async (_, { lobbyId }) => {
            try {
                const lobby = await Lobby.findOne({ id: lobbyId }).exec();
                return lobby;
            } catch (error) {
                console.error('Error fetching lobby by ID:', error);
                throw error;
            }
        },

    },

    Mutation: {
        userJoinLobby: async function (_, args, context) {
            // console.log('args data: ', args);
            const lobby = await Lobby.findOne({ name: args.name });

            if (!lobby) {
                throw new AuthenticationError('No Lobby Found With This Name');
            }

            return await Lobby.findOneAndUpdate(
                { _id: lobby._id },
                {
                    $addToSet: { users: context.user._id }
                },
                {
                    new: true
                }
            );
        },

        /* 
        findById() solo funciona con _id, no con otro campo. 
        usar .finOne para otros campos, como el id que usa un UUID 
         */
        createMessage: async (_, { lobbyId, text }, context) => {
            const user = context.user; //

            if (!user) {
                throw new AuthenticationError("You must be logged in to create a message");
            }

            //busca el lobby, 
            const lobby = await Lobby.findOne({ id: lobbyId });
            if (!lobby) {
                throw new Error("Lobby not found");
            }

            // busca si el usuario ya se encuentra en el array de users
            const alreadyInLobby = lobby.users.some(u => u.equals(user._id));
            if (!alreadyInLobby) {
                lobby.users.push(user._id);
                await lobby.save();
            }


            //crea el nuevo mensaje
            const newMessage = await Message.create({
                text,
                lobby: lobbyId,
                username: user.username,
                user_id: user._id,
                // createdAt: new Date(), since it should be automatic
            });

            return newMessage;
        },

        createGoodMessage: async (_, { lobbyId, text, username }, { user }) => {
            // Ensure that 'username' is valid
            const userHere = await User.findOne({ username });

            if (!userHere) {
                throw new AuthenticationError('User not found');
            }

            const newMessage = new Message({
                text,
                user_id: userHere._id,
                username: userHere.username,
                lobbyId,
            });

            await newMessage.save();

            return newMessage;
        },

        login: async function (_, { email, password }) {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email');
            }

            // Use the model's comparePassword method
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new ApolloError('Invalid credentials', 'INVALID_CREDENTIALS');
            }

            // Update login timestamp and count
            user.loginTimestamp = new Date();
            user.loginCount += 1;
            await user.save();

            const token = signToken(user);
            return { token, user };
        },

        createUser: async function (parent, args) {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        createLobby: async function (parent, args, context) {
            const user = context.user;

            if (!user) {
                throw new AuthenticationError("You must be logged in to create a lobby");
            }

            const newId = uuidv4();
            const newLobby = await Lobby.create({
                id: newId,
                name: args.name,
                emoji: args.emoji,
                users: [user._id]
            });

            return newLobby;
        }

    },

    Subscription: {
        messageAdded: {
            subscribe: (_, { lobby }) => {
                return pubsub.asyncIterator([`MESSAGE_ADDED_${lobby}`]);
            },
        },
    },
};

module.exports = resolvers;
