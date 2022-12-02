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
  setStartPusher: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [channelId, setChannelId] = useState("");
  const [userId, setUserId] = useState("");
  const [payload, setPayload] = useState<Payload>({} as Payload);
  const [startPusher, setStartPusher] = useState(false);

  async function joinChannel(name: string) {
    // const channel = pusher.subscribe(`presence-${name}`);
    const channel = pusher?.subscribe(name);

    channel.bind(
      "pusher:subscription_succeeded",
      async (data: PresenceChannel) => {
        setUserId(data.myID);
        // Update DB userCount
        await axios.post("/api/room", {
          channelId: channelId,
          userCount: 1,
        });
      }
    );

    channel.bind("message", (data: any) => {
      console.log("DATA FROM JOIN CHANNEL", data.message);
      setPayload({ message: data.message, user: data.userId });
    });

    channel.bind("pusher:member_added", async (data: any) => {
      console.log("Hello from member_added event", data);
      // Close the room as soon as someone joins it
      await axios.post("/api/room", {
        channelId: channelId,
        isFull: true,
      });
    });

    channel.bind("pusher:member_removed", async () => {
      console.log("Goodbye from member_removed event");
      // Kill session if someone leaves
      await axios.post("/api/room", {
        channelId: channelId,
        isClosed: true,
      });
    });
  }

  async function sendMessage(text: string) {
    await axios.post("/api/pusher", {
      channelId: channelId,
      message: text,
      userId: userId,
    });
  }

  const pusherCtx = {
    joinChannel,
    sendMessage,
    setChannelId,
    channelId,
    userId,
    payload,
    setStartPusher,
  };

  useEffect(() => {
    if (startPusher) {
      if (process.env.NODE_ENV !== "production") {
        // Enable pusher logging - isn't included in production
        PusherJs.logToConsole = true;
      }

      pusher = new PusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        forceTLS: true,
        authEndpoint: "api/pusher/auth",
      });
    }
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
  }, [startPusher]);

  return (
    <PusherContext.Provider value={pusherCtx}>
      {children}
    </PusherContext.Provider>
  );
};
