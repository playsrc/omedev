import { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../../lib/pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, channelId, userId } = req.body;

  try {
    await pusher.trigger(channelId, "message", {
      message,
      userId,
    });
  } catch (error) {
    console.error("/api/pusher error", error);
  }

  res.json({ status: 200 });
}
