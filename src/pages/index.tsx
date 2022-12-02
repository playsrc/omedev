import { Box, Button, Grid, Text, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { FormEvent, useContext, useState } from "react";
import Chat from "../components/Chat";
import Header from "../components/Header";
import { PusherContext } from "../context/pusherContext";

export default function Home() {
  const backgroundColor = useColorModeValue("orange.50", "gray.800");
  const [redirectToChat, setRedirectToChat] = useState(false);

  const { setStartPusher } = useContext(PusherContext);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStartPusher(true);

    setRedirectToChat(true);
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

        {redirectToChat ? (
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
