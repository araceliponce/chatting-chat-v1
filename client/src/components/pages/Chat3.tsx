import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { CREATE_MESSAGE } from "@/graphql_utils/mutations";
import styles from './chat.module.scss';
import { QUERY_MESSAGES_BY_LOBBY_ID } from "@/graphql_utils/queries";
import { getTimestampFromSeconds, groupMessagesByDate } from "@/utils/functions";

interface ChatProps {
  socket: Socket;
}

export default function Chat3({ socket }: ChatProps) {
  const { user, loading } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }



  const { id: lobbyId } = useParams();
  // console.log('lobbyid', lobbyId)

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);


  // Fetch all prev messages 
  const { data } = useQuery(QUERY_MESSAGES_BY_LOBBY_ID, {
    variables: { lobbyId },
    skip: !lobbyId, // skip the query if lobbyId is not available
  });


  const [createMessage] = useMutation(CREATE_MESSAGE);

  useEffect(() => {
    if (lobbyId) {
      // Join the room when the component mounts
      socket.emit("join_room", lobbyId);

      // Listen for incoming messages in real-time
      socket.on("receive_message", (newMessage, serverOffset) => {
        // console.log('SERVER OFFSET', { serverOffset });

        // Adjust timestamps if needed using serverOffset
        if (serverOffset) {
          const adjustedMessage = {
            ...newMessage,
            createdAt: new Date(newMessage.createdAt + serverOffset)
          };
          setMessages((prevMessages) => [...prevMessages, adjustedMessage]);
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      // when the component unmounts, clear the listener(?
      return () => {
        socket.off("receive_message");
      };
    }
  }, [lobbyId, socket]);

  // When the query is complete and messages are fetched, set the initial messages
  // this is so high risk, console log to write the correct data
  // console.log('data!!', data, user)
  useEffect(() => {
    if (data && data.messagesByLobbyId) {
      setMessages(data.messagesByLobbyId);

      setTimeout(() => {

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

      }, 10);

    }
  }, [data]);



  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      try {
        // envia el mensaje al server graphql
        const response = await createMessage({
          variables: {
            lobbyId: lobbyId || "",
            text: message,
          },
        });

        const newMessage = response.data.createMessage;

        // emite el mensaje al server de socket
        socket.emit("send_message", {
          lobbyId,
          text: message,
          username: user?.username,
          createdAt: newMessage.createdAt,
        });

        // actualiza messages a renderizar con el new message
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // vacía el input
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <main className="">
      <div className="section-container">
        {user ? (
          <div className={styles.chat}>

            <div className={styles.chat__list}>
              {Object.keys(groupedMessages).map((dateLabel) => {
                const messagesForDate = groupedMessages[dateLabel];

                return (
                  <section key={dateLabel} className="pt-4 space-y-2">
                    <div
                      className={styles.chat__subtitle}
                    >
                      {dateLabel}
                    </div>

                    <ol>
                      {messagesForDate.map((msg, index) => {
                        const isMyMessage = msg.username === user.username;
                        const messageStyle = isMyMessage ? styles.mine : styles.notmine;
                        const timestamp = getTimestampFromSeconds(msg.createdAt);

                        return (
                          <li key={index} className={`${messageStyle} ${styles.msg__wrapper}`}>
                            <p className={styles.msg__text}>{msg.text}</p>

                            <div className="flex flex-wrap items-center gap-1 pl-2 pt-1 pb-2 text-xs">
                              <div className="size-2 bg-pink-300 rounded-full"></div>
                              <small className="font-bold">{msg.username}</small>
                              <small
                                className="opacity-70"
                              >
                                {timestamp.hourTimestamp}
                              </small>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                );
              })}
            </div>


            <div className={`section-container ${styles.chat__type}`}>
              <div className="input-btn-container">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type here"
                />
                <div className="btn-wrapper sm:hidden">
                  <button className="btn--main" onClick={handleSendMessage}>
                    Send
                  </button>
                </div>
                <div className="btn-wrapper hidden sm:grid">
                  <button onClick={handleSendMessage} className="btn--main hidden sm:grid sm:min-w-[20ch]">
                    {message.trim().length > 0 ? "Send it!" : "Send a message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>You need to be logged in to join a room.</p>
        )}
      </div>
    </main>
  );
};
