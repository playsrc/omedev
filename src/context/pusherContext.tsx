import axios from "axios";
import PusherJs from "pusher-js";
import { createContext, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type Context = {
  joinChannel: (name: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  setChannelId: React.Dispatch<React.SetStateAction<string>>;
  channelId: string;
  userId: string;
  payload: Payload;
};

type PresenceChannel = {
  members: {};
  count: number;
  me: {
    id: string;
    info?: any;
  };
  myID: string;
};

export type Payload = {
  message: string;
  user: string;
};

let pusher: PusherJs;

export const PusherContext = createContext<Context>({} as any);

export const PusherProvider = ({ children }: Props) => {
  const [channelId, setChannelId] = useState({} as any);
  const [userId, setUserId] = useState("");
  const [payload, setPayload] = useState<Payload>({} as Payload);

  async function joinChannel(name: string) {
    const channel = pusher.subscribe(`presence-${name}`);

    channel.bind("pusher:subscription_succeeded", (data: PresenceChannel) => {
      setUserId(data.myID);
    });

    channel.bind("message", (data: any) => {
      console.log("DATA FROM JOIN CHANNEL", data.message);
      setPayload({ message: data.message, user: userId });
      // setMessages((prev) => [...prev, data.message]);
    });
  }

  async function sendMessage(text: string) {
    await axios.post("/api/pusher", {
      channelId: channelId,
      message: text,
    });
  }

  const pusherCtx = {
    joinChannel,
    sendMessage,
    setChannelId,
    channelId,
    userId,
    payload,
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // Enable pusher logging - isn't included in production
      PusherJs.logToConsole = true;
    }

    pusher = new PusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
      forceTLS: true,
      authEndpoint: "api/pusher/auth",
    });

    // channel.bind("pusher:subscription_succeeded", (data: any) => {
    //   setData(data);
    //   console.log("Subscription succeeded!", data);
    // });

    // channel.bind("pusher:member_added", (data: any) => {
    //   console.log("Hello from member_added event", data);
    // });

    // channel.bind("pusher:member_removed", () => {
    //   console.log("Goodbye from member_removed event");
    // });

    // channel.bind("chat-update", (data: any) => {
    //   console.log("Data from chat-update", data);
    // });

    // return () => {
    //   // pusher.unsubscribe("presence-channel");
    // };
  }, []);

  return (
    <PusherContext.Provider value={pusherCtx}>
      {children}
    </PusherContext.Provider>
  );
};
