import { FormEvent, useEffect, useState } from "react";
import Pusher from "pusher-js";

interface IMessages {
  id: number;
  username: string;
  message: string;
}

export default function Home() {
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        message,
      }),
    });

    setMessage("");
  }

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    const channel = pusher.subscribe("chat");

    channel.bind("message", function (data: IMessages) {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind("message");
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <p>
              <strong>{msg.username}</strong>: {msg.message}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}
