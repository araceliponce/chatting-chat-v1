const { Schema, model, Types } = require('mongoose');

const lobbySchema = new Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            unique: true
        },
        emoji: {
            type: String,
            unique: true,
        },
        users: [{
            type: Types.ObjectId,
            ref: 'user'
        }]
    },
    {
        timestamps: true,
    }
);

const Lobby = model('lobby', lobbySchema);

module.exports = Lobby;