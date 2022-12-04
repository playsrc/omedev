// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../utils/server.pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Invalid method" });
  }

  try {
    const { username, message } = req.body;

    pusher.trigger("chat", "message", {
      id: Math.floor(Math.random() * 1000),
      message,
      username,
    });

    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error("api/messages error", error);
    res.status(500);
  }
}
