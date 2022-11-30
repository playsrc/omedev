import {
  Box,
  Button,
  Code,
  Grid,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormEvent, useContext, useEffect, useMemo, useState } from "react";
import { Payload, PusherContext } from "../context/pusherContext";

function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState([{} as Payload]);

  const { sendMessage, joinChannel, channelId, userId, payload } =
    useContext(PusherContext);

  useMemo(
    () =>
      setMessage((prev: any) => [
        ...prev,
        { message: payload.message, user: payload.user },
      ]),
    [payload.message, payload.user]
  );

  const chatBoxBackground = useColorModeValue("white", "whiteAlpha.200");
  const borderColor = useColorModeValue("gray.400", "gray.900");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await sendMessage(newMessage);

    setNewMessage("");
  }

  useEffect(() => {
    joinChannel(channelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (typeof window !== "undefined") {
  //   window.addEventListener("beforeunload", (e) => {
  //     e.returnValue = "Are you sure you want to leave? You will lose your chat";
  //   });
  // }

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
        {/* <Text fontSize="sm" fontWeight="bold" opacity={0.8}>
          You&apos;re now chatting with a random developer.
        </Text> */}

        <Text fontSize="sm" fontWeight="bold" opacity={0.8}>
          Looking for someone you can chat with...
        </Text>
        <Box>
          <Text textColor="green" fontWeight="bold">
            ** DEBUG **
          </Text>
          <Text>
            My ID: <Code as="span">{userId}</Code>{" "}
          </Text>
          <Text>
            Room ID: <Code as="span">{channelId}</Code>
          </Text>

          {message.map((msg, index) => (
            <Box key={index}>
              <Text>{msg?.user}</Text>
              <Text>{msg?.message}</Text>
            </Box>
          ))}
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
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <Button
          borderRadius="none"
          flexDir="column"
          blockSize="100%"
          backgroundColor={"blue.400"}
          textColor="white"
          _hover={{ backgroundColor: "blue.500" }}
          onClick={onSubmit}
        >
          <Text>Send</Text>
        </Button>
      </Grid>
    </Grid>
  );
}

export default Chat;
