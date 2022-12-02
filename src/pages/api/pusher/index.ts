import { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../../lib/pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, channelId, userId } = req.body;

  console.log("Data from the backend", req.body);

  await pusher.trigger(channelId, "message", {
    message,
    userId,
  });

  res.json({ status: 200 });
}
