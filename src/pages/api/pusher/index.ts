import { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../../lib/pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, channelId } = req.body;

  console.log("Data from the backend", req.body);

  await pusher.trigger(`presence-${channelId}`, "message", {
    message,
  });

  res.json({ status: 200 });
}
