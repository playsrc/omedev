import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/server.prismadb";

export default async function searchUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let availableRoom = undefined;

  const randomString = Math.random().toString(36).slice(2);
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1); // Tomorrow

  availableRoom = await db.rooms.findFirst({
    where: { isFull: { equals: false } },
  });

  if (!availableRoom) {
    availableRoom = await db.rooms.create({
      data: {
        pusherId: `presence-${randomString}`,
        expireAt: expireDate,
      },
    });
  }

  res.status(200).json(availableRoom);
}
