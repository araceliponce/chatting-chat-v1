//Express
const express = require('express')
const http = require("http");
const cors = require("cors");

const app = express()
// const { expressMiddleware } = require('@apollo/server/express4')

const { ApolloServer } = require('apollo-server-express')


// const { Server as SocketServer } = require('socket.io') //that doesnt work
const SocketServer = require('socket.io').Server;


const path = require('path');

// Custom middleware, schemas, and database
const { authMiddleware } = require('./middleware/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection')

const PORT = process.env.PORT || 3001

// Set up Apollo Server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send('hello!')
})

// Create HTTP server instance
const serverHttp = http.createServer(app);

// Setting up socket.io https://www.youtube.com/watch?v=KE8Hy6YNWYY min 10
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'];

const io = new SocketServer(serverHttp, {
    cors: {
        origin: [allowedOrigins],
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    // console.log(`socket.io says ${socket.id} connected`);


    socket.on("join_room", (lobbyId) => {
        socket.join(lobbyId);
        // console.log(`User joined room: ${lobbyId}`);
    });


    socket.on('send_message', (message) => {

        // console.log(`socket.io says new message: `, message);
        // console.log(`socket.io says new message`);
        if (message.lobbyId) {
            socket.to(message.lobbyId).emit("receive_message", message);
        } else {
            console.error("Message is missing a the lobby id");
        }
    })



    socket.on('disconnect', () => {
        // console.log(`socket.io says ${socket.id} disconnected`)
    })

});

async function startServer(typeDefs, resolvers) {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app })

    db.once('open', () => {
        // serverHttp.listen(PORT, () => {
        // https://render.com/docs/web-services Your web service must bind to a port on host 0.0.0.0 to receive HTTP requests from the public internet. The default expected port is 10000 (you can configure this).
        serverHttp.listen(PORT, '0.0.0.0', () => {
            // console.log(`Running on http://localhost:${PORT}`);
            // console.log(`Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`);
        });
    });
}

startServer(typeDefs, resolvers);