import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/prismadb";

export default async function searchUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let availableRoom = undefined;

  const randomString = Math.random().toString(36).slice(2);

  availableRoom = await db.rooms.findFirst({
    where: { userCount: { lt: 2 } },
  });

  if (!availableRoom) {
    availableRoom = await db.rooms.create({
      data: {
        pusherId: `presence-${randomString}`,
      },
    });
  }

  res.status(200).json(availableRoom);
}
