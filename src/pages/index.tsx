import {
  Box,
  Button,
  Grid,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { FormEvent, useContext, useState } from "react";
import Chat from "../components/Chat";
import Header from "../components/Header";
import { PusherContext } from "../context/pusherContext";

export default function Home() {
  const backgroundColor = useColorModeValue("orange.50", "gray.800");
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const { setChannelId } = useContext(PusherContext);
  const [id, setId] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSearchingUsers(true);

    setChannelId(id);
  }

  return (
    <>
      <Head>
        <title>OmeDEV: Talk to developers!</title>
        <link rel="icon" href="/icon.png" type="image/png" />
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
            <form onSubmit={onSubmit}>
              <Input
                placeholder="Enter chat ID"
                onChange={(e) => setId(e.target.value)}
              />
              <Button type="submit">Go!</Button>
            </form>
          </Box>
        )}
      </Grid>
    </>
  );
}
