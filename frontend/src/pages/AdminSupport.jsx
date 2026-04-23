import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import SideMenu from "../components/SideMenu";
import { useSupportSocket } from "../chat/useSupportSocket";
import "../styles/support.css";

function AdminSupport() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [text, setText] = useState("");

  const {
    status,
    messages,
    error,
    connect,
    joinAdminChat,
    sendMessage,
  } = useSupportSocket();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/support/admin/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChats(res.data);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    fetchChats();
  }, []);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const handleOpenChat = (chat) => {
    setSelectedChatId(chat.id);
    setSelectedChat(chat);
    joinAdminChat(chat.id);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage(text);
    setText("");
  };

  return (
    <div className="page-container support-page">
      <SideMenu />

      <h1 className="support-title">Admin Support</h1>
      <p className="support-subtitle">
        Здесь администратор отвечает пользователям магазина.
      </p>

      <div className={`support-status ${status}`}>Status: {status}</div>

      {error && <div className="support-error">{error}</div>}

      <div className="support-shell">
        <div className="support-sidebar">
          <div className="support-sidebar-title">Chats</div>

          {chats.length === 0 ? (
            <div className="support-empty">Чатов пока нет</div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                className={`support-chat-card ${
                  selectedChatId === chat.id ? "active" : ""
                }`}
                onClick={() => handleOpenChat(chat)}
              >
                <div className="support-chat-card-name">{chat.user?.name}</div>
                <div className="support-chat-card-email">{chat.user?.email}</div>
                <div className="support-chat-card-status">
                  Status: {chat.status}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="support-chat">
          <div className="support-chat-header">
            <div className="support-chat-title">
              {selectedChat ? selectedChat.user?.name : "Выбери чат"}
            </div>
            <div className="support-chat-meta">
              {selectedChat
                ? selectedChat.user?.email
                : "Слева появится список диалогов"}
            </div>
          </div>

          <div className="support-messages">
            {!selectedChatId ? (
              <div className="support-empty">Выбери чат слева</div>
            ) : messages.length === 0 ? (
              <div className="support-empty">Сообщений пока нет</div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.sender?.id === currentUser?.id;

                return (
                  <div
                    key={msg.id}
                    className={`support-message-row ${isAdmin ? "user" : "admin"}`}
                  >
                    <div className={`support-bubble ${isAdmin ? "user" : "admin"}`}>
                      <div className="support-bubble-header">
                        {msg.sender?.name || "Unknown"}
                      </div>
                      <div className="support-bubble-text">{msg.text}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedChatId && (
            <form className="support-form" onSubmit={handleSend}>
              <input
                className="support-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ответить пользователю..."
              />
              <button className="support-send-btn" type="submit">
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSupport;