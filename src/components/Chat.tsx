import {
  Box,
  Button,
  Code,
  Flex,
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
      templateRows="1fr 90px"
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
        </Box>
        {message.map((msg: any, index) => (
          <Box key={index}>
            {msg?.user !== userId && msg?.user?.length > 0 ? (
              <Text as="strong" color="red.400">
                Developer:{" "}
              </Text>
            ) : (
              msg?.user?.length > 0 && (
                <Text as="strong" color="blue.400">
                  You:{" "}
                </Text>
              )
            )}
            {msg?.message?.length > 0 && (
              <Text display="inline-block">{msg?.message}</Text>
            )}
          </Box>
        ))}
      </Box>
      <Flex gap={2}>
        <Button
          width={"150px"}
          borderRadius="none"
          borderBottomLeftRadius={10}
          flexDir="column"
          blockSize="100%"
          border={"1px solid"}
          borderColor={borderColor}
          backgroundColor={chatBoxBackground}
        >
          <Text>New</Text>
        </Button>
        <Textarea
          variant="unstyled"
          height={"full"}
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
          width={"150px"}
          borderRadius="none"
          borderBottomRightRadius={10}
          flexDir="column"
          blockSize="100%"
          border={"1px solid"}
          borderColor={borderColor}
          backgroundColor={chatBoxBackground}
          onClick={onSubmit}
        >
          <Text>Send</Text>
        </Button>
      </Flex>
    </Grid>
  );
}

export default Chat;
