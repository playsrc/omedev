import axios from "axios";
import PusherJs from "pusher-js";
import { createContext, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type Context = {
  joinChannel: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  setChannelId: React.Dispatch<React.SetStateAction<string>>;
  channelId: string;
  userId: string;
  payload: Payload;
  setStartPusher: React.Dispatch<React.SetStateAction<boolean>>;
  foundUser: boolean;
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
  const [foundUser, setFoundUser] = useState(false);

  async function joinChannel() {
    const availableRoom = await axios.get("/api/searchUser");
    const { data } = availableRoom;

    setChannelId(data.pusherId);
    const pusherId = data.pusherId;

    const channel = pusher?.subscribe(pusherId);

    /**
     * Known bug: if multiple users login
     * before pusher registers this event it will
     * create a room of more than just 2 people
     */

    // TODO: Fix that bug by delaying room attribution/creation before this event
    channel.bind(
      "pusher:subscription_succeeded",
      async (data: PresenceChannel) => {
        setUserId(data.myID);
        // Update userCount in the database
        await axios.post("/api/room", {
          channelId: pusherId,
          userCount: data.count,
        });

        if (data.count === 2) {
          // Unlock and start chat
          setFoundUser(true);
        }
      }
    );

    channel.bind("message", (data: any) => {
      console.log("DATA FROM JOIN CHANNEL", data.message);
      setPayload({ message: data.message, user: data.userId });
    });

    channel.bind("pusher:member_added", async (data: any) => {
      console.log("Hello from member_added event", data);
      setFoundUser(true);
    });

    channel.bind("pusher:member_removed", async () => {
      console.log("Goodbye from member_removed event");
      // TODO split this for when it finds a user and when a user disconnects
      setFoundUser(false);

      // Send isClose to terminate the room
      await axios.post("/api/room", {
        channelId: pusherId,
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
    foundUser,
  };

  useEffect(() => {
    // Only start pusher at specific moments
    // TODO: Maybe implement a way to kill/restart it?
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
  }, [startPusher]);

  return (
    <PusherContext.Provider value={pusherCtx}>
      {children}
    </PusherContext.Provider>
  );
};
