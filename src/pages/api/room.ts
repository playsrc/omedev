import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/prismadb";

export default async function room(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { channelId, userCount, isClosed, isFull } = req.body;

    const currentUserCount = (await db.rooms.findFirst({
      where: { pusherId: channelId },
      select: { userCount: true },
    })) || { userCount: 0 };

    // Populate the room at first subscription

    // if (currentUserCount.userCount === 0) {
    //   console.log("HEEEEEY");
    //   await db.rooms.update({
    //     where: {
    //       pusherId: channelId,
    //     },
    //     data: {
    //       userCount: { increment: 1 },
    //     },
    //   });
    // }

    res.json({ everything: "OK" });
  } catch (error) {
    console.error("api/room error", error);
    res.status(500);
  }
}
