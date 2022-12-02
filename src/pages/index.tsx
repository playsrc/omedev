import {
  Box,
  Button,
  Grid,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { FormEvent, useContext, useState } from "react";
import Chat from "../components/Chat";
import Header from "../components/Header";
import { PusherContext } from "../context/pusherContext";

export default function Home() {
  const backgroundColor = useColorModeValue("orange.50", "gray.800");
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const { setChannelId, setStartPusher } = useContext(PusherContext);
  const [id, setId] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStartPusher(true);

    try {
      const availableRoom = await axios.get("/api/searchUser");
      const { data } = availableRoom;
      console.log(`Channel: ${data.pusherId}\nuserCount: ${data.userCount}`);

      setChannelId(data.pusherId);
    } catch (error) {
      console.error(error);
    }

    setIsSearchingUsers(true);
  }

  return (
    <>
      <Head>
        <title>OmeDEV: Talk to developers!</title>
        <link rel="icon" href="/icon.png" type="image/png" />
        <meta
          name="description"
          content="The Internet is full of cool developers; OmeDEV lets you meet them. When you use OmeDEV, we pick someone else at random so you can have a one-on-one chat."
        />
      </Head>
      <Grid
        templateRows="max-content 1fr"
        minHeight="100vh"
        backgroundColor={backgroundColor}
      >
        <Header />

        {isSearchingUsers ? (
          <Chat />
        ) : (
          // FOR DEBUG PURPOSES AND TESTING
          <Box>
            <Text>Start the chat?</Text>
            <Button onClick={onSubmit}>Go!</Button>
          </Box>
        )}
      </Grid>
    </>
  );
}
