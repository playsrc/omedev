/**
 * TODO
 * Rewrite the entire component
 * Fix Pusher using Auth
 */

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Kbd,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import Pusher from "pusher-js";
import React, { FormEvent, useEffect, useState } from "react";

// interface IMessages {
//   id: number;
//   username: string;
//   message: string;
// }

function Chat() {
  // const [messages, setMessages] = useState<IMessages[]>([]);
  // const [message, setMessage] = useState("");
  // const [username, setUsername] = useState("");

  // async function onSubmit(event: FormEvent) {
  //   event.preventDefault();

  //   await fetch(`${process.env.NEXT_PUBLIC_URL}/api/message`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       username,
  //       message,
  //     }),
  //   });

  //   setMessage("");
  // }

  // useEffect(() => {
  //   // Enable pusher logging - don't include this in production
  //   Pusher.logToConsole = true;

  //   const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  //     cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  //   });

  //   const channel = pusher.subscribe("chat");

  //   channel.bind("message", function (data: IMessages) {
  //     setMessages((prev) => [...prev, data]);
  //   });

  //   return () => {
  //     channel.unbind("message");
  //   };
  // }, []);

  const chatBoxBackground = useColorModeValue("white", "whiteAlpha.200");
  const borderColor = useColorModeValue("gray.400", "gray.900");

  return (
    <Grid
      templateRows="1fr 80px"
      borderRadius={10}
      minHeight="100%"
      gap={"2"}
      px={3}
      py={4}
    >
      <Box
        borderTopRadius={10}
        backgroundColor={chatBoxBackground}
        border="1px solid"
        borderColor={borderColor}
        p={2}
      >
        <Text fontSize="sm" fontWeight="bold" opacity={0.8}>
          You&apos;re now chatting with a random developer.
        </Text>
        <Box>
          <Text as="span" textColor="green" fontWeight="bold">
            ** DEBUG **
          </Text>
          <Text>My ID: </Text>
          <Text>Stranger ID: </Text>
          <Text>Room ID: </Text>
          <Text>User Pool: </Text>
        </Box>
      </Box>
      <Grid
        overflow="hidden"
        templateColumns="100px 1fr 100px"
        gap={2}
        borderBottomRadius={10}
      >
        <Button
          borderRadius="none"
          flexDir="column"
          blockSize="100%"
          backgroundColor={"blue.400"}
          textColor="white"
          _hover={{ backgroundColor: "blue.500" }}
        >
          <Text>New</Text>
        </Button>
        <Textarea
          variant="unstyled"
          p={2}
          resize="none"
          border={"1px solid"}
          borderRadius="none"
          borderColor={borderColor}
          backgroundColor={chatBoxBackground}
        />
        <Button
          borderRadius="none"
          flexDir="column"
          blockSize="100%"
          backgroundColor={"blue.400"}
          textColor="white"
          _hover={{ backgroundColor: "blue.500" }}
        >
          <Text>Send</Text>
        </Button>
      </Grid>
    </Grid>
  );
}

export default Chat;
