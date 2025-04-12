import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache
} from "@apollo/client";
import io from "socket.io-client";
import { STORAGE_KEY } from "./utils/constants";
import CustomRouter from "./Router";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const GRAPHQL_URL = BACKEND_URL + '/graphql';



const socket = io(BACKEND_URL, {
  // const socket = io("/", {
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: 10,
  transports: ['websocket'],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false
});
socket.on('connect', () => {
  // console.log('CLIENT connected to WebSocket server');
});



// console.log('Token being sent:', localStorage[STORAGE_KEY]);  

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(STORAGE_KEY);
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});


const client = new ApolloClient({
  link: ApolloLink.from([
    authLink, // Attach the authLink
    new HttpLink({ uri: GRAPHQL_URL })
  ]),
  cache: new InMemoryCache(),
});


function App() {

  return (
    <ApolloProvider client={client}>

      <CustomRouter socket={socket} />

    </ApolloProvider>
  )
}

export default App
