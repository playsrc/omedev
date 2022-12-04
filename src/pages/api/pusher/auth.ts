import { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../../utils/server.pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { socket_id, channel_name } = req.body;
  // console.log("FROM AUTH: ", req.body);

  // const authResponse = pusher.authorizeChannel(socket_id, channel_name);
  // res.send(authResponse);

  // PRESENCE CHANNEL AUTH
  const randomString = Math.random().toString(36).slice(2);
  const presenceData = {
    user_id: randomString,
  };
  try {
    const authResponse = pusher.authorizeChannel(
      socket_id,
      channel_name,
      presenceData
    );
    res.send(authResponse);
  } catch (error) {
    console.error("/API/PUSHER/AUTH ERROR: ", error);
  }
}
