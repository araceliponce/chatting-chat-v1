const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        lobby: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Message = model('message', messageSchema);

module.exports = Message;