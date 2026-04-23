import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useSupportSocket() {
  const socketRef = useRef(null);

  const [status, setStatus] = useState("disconnected");
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [error, setError] = useState("");

  const connect = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      autoConnect: false,
      auth: { token },
    });

    socketRef.current = socket;
    setStatus("connecting");
    setError("");

    socket.on("connect", () => {
      setStatus("connected");
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.on("connect_error", (e) => {
      setStatus("error");
      setError(e.message || "Connection error");
    });

    socket.on("support:history", (payload) => {
      setChatId(payload.chatId);
      setMessages(payload.messages || []);
    });

    socket.on("support:new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.connect();
  }, []);

  const joinAdminChat = useCallback((targetChatId) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("support:join-admin", { chatId: targetChatId }, (ack) => {
      if (!ack?.ok) {
        setError(ack?.error || "Join error");
      }
    });
  }, []);

  const sendMessage = useCallback((text) => {
    const socket = socketRef.current;
    if (!socket || !chatId) return;

    socket.emit("support:message", { chatId, text }, (ack) => {
      if (!ack?.ok) {
        setError(ack?.error || "Send error");
      }
    });
  }, [chatId]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    status,
    messages,
    chatId,
    error,
    connect,
    joinAdminChat,
    sendMessage,
  };
}