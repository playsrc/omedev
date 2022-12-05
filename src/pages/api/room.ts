import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/server.prismadb";

export default async function room(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { channelId, userCount, isClosed } = req.body;

    // Update isFull to close the room
    if (userCount === 2) {
      await db.rooms.update({
        data: {
          isFull: true,
        },
        where: {
          pusherId: channelId,
        },
      });
    }

    // Delete the room when someone disconnects
    if (isClosed) {
      try {
        await db.rooms.delete({
          where: {
            pusherId: channelId,
          },
        });
      } catch (error) {
        console.error("Delete room error", error);
      }
    }

    res.json({ everything: "OK" });
  } catch (error) {
    console.error("api/room error", error);
    res.status(500);
  }
}
