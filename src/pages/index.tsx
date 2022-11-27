import { Box, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import Chat from "../components/Chat";
import Header from "../components/Header";

export default function Home() {
  const backgroundColor = useColorModeValue("orange.50", "gray.800");

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
        <Chat />
      </Grid>
    </>
  );
}
