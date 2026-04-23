import { useEffect, useMemo, useState } from "react";
import SideMenu from "../components/SideMenu";
import { useSupportSocket } from "../chat/useSupportSocket";
import "../styles/support.css";

function Support() {
  const { status, messages, error, connect, sendMessage } = useSupportSocket();
  const [text, setText] = useState("");

  useEffect(() => {
    connect();
  }, [connect]);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage(text);
    setText("");
  };

  return (
    <div className="page-container support-page">
      <SideMenu />

      <h1 className="support-title">Support Chat</h1>
      <p className="support-subtitle">
        Здесь ты можешь написать в поддержку магазина.
      </p>

      <div className={`support-status ${status}`}>Status: {status}</div>

      {error && <div className="support-error">{error}</div>}

      <div className="support-chat">
        <div className="support-chat-header">
          <div className="support-chat-title">Диалог с поддержкой</div>
          <div className="support-chat-meta">
            Ответы администратора приходят в реальном времени
          </div>
        </div>

        <div className="support-messages">
          {messages.length === 0 ? (
            <div className="support-empty">
              Сообщений пока нет. Напиши первым.
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender?.id === currentUser?.id;

              return (
                <div
                  key={msg.id}
                  className={`support-message-row ${isUser ? "user" : "admin"}`}
                >
                  <div className={`support-bubble ${isUser ? "user" : "admin"}`}>
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

        <form className="support-form" onSubmit={handleSend}>
          <input
            className="support-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите сообщение..."
          />
          <button className="support-send-btn" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Support;