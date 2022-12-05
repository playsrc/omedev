import {
  Box,
  Button,
  Code,
  Flex,
  Grid,
  Spinner,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Payload, PusherContext } from "../context/pusherContext";

function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState([{} as Payload]);
  const [stopCount, setStopCount] = useState(1);

  const buttonRef = useRef<any>(null);
  const messageRef = useRef<null | HTMLDivElement>(null);

  // A random delay to *ATTEMPT* to prevent multiple connections beyond room the limits
  const delay = Math.floor(Math.random() * 10000 + 1);

  const {
    sendMessage,
    joinChannel,
    channelId,
    userId,
    payload,
    foundUser,
    userQuit,
    setUserQuit,
    setStop,
    stop,
    setFoundUser,
  } = useContext(PusherContext);

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

  function handleStopButton() {
    setStopCount((prev) => prev + 1);
    setStop(true);
    setFoundUser(false);

    if (stopCount > 1) {
      window.location.reload();
    } else if (userQuit) {
      window.location.reload();
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!newMessage.trim()) {
      return;
    }
    await sendMessage(newMessage);

    setNewMessage("");
  }

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        e.preventDefault();
        handleStopButton();
        return;
      }
    });
  }

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [payload.message, userQuit]);

  useEffect(() => {
    setTimeout(() => joinChannel(), delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (typeof window !== "undefined") {
  //   window.addEventListener("beforeunload", (e) => {
  //     e.returnValue = "Are you sure you want to leave? You will lose your chat";
  //   });
  // }

  return (
    <Grid
      width="100%"
      templateRows="1fr 90px"
      minHeight="100%"
      maxWidth="1440px"
      margin="0 auto"
      gap={"2"}
      p={{ md: "4", base: "0" }}
    >
      <Box
        borderTopRadius={{ md: 10, base: "unset" }}
        backgroundColor={chatBoxBackground}
        border="1px solid"
        borderColor={borderColor}
        height="100%"
        position={"relative"}
        overflow="hidden"
      >
        <Box
          overflowY="auto"
          position="absolute"
          inset={0}
          px={3}
          py={2}
          lineHeight={1.5}
        >
          <Box mb={4}>
            <Text fontWeight="bold">** DEBUG **</Text>
            <Text>
              My ID: <Code as="span">{userId}</Code>{" "}
            </Text>
            <Text>
              Room ID: <Code as="span">{channelId}</Code>
            </Text>
          </Box>

          {foundUser ? (
            <Text fontSize="sm" fontWeight="bold">
              You&apos;re now chatting with a random developer.
            </Text>
          ) : (
            !userQuit &&
            !stop && (
              <Flex>
                <Spinner mr={2} />
                <Text fontSize="sm" fontWeight="bold">
                  Looking for someone you can chat with...
                </Text>
              </Flex>
            )
          )}

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
                <Text ref={messageRef} display="inline-block">
                  {msg?.message}
                </Text>
              )}
            </Box>
          ))}

          {userQuit ? (
            <Text>Developer has disconnected!</Text>
          ) : (
            stop && <Text>You have disconnected!</Text>
          )}
        </Box>
      </Box>
      <Flex gap={2}>
        <Button
          ref={buttonRef}
          width={"150px"}
          borderRadius="none"
          borderBottomLeftRadius={{ md: 10, base: "unset" }}
          flexDir="column"
          blockSize="100%"
          border={"1px solid"}
          borderColor={borderColor}
          color={stop || userQuit ? "white" : "unset"}
          backgroundColor={stop || userQuit ? "blue.500" : chatBoxBackground}
          gap={1}
          onClick={handleStopButton}
        >
          {stop || userQuit ? <Text>New</Text> : <Text>Stop</Text>}
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
          disabled={!foundUser}
        />
        <Button
          display={{ md: "flex", base: "none" }}
          width={"150px"}
          borderRadius="none"
          borderBottomRightRadius={10}
          flexDir="column"
          blockSize="100%"
          border={"1px solid"}
          borderColor={borderColor}
          backgroundColor={chatBoxBackground}
          onClick={onSubmit}
          disabled={!foundUser}
          gap={1}
        >
          <Text>Send</Text>
        </Button>
      </Flex>
    </Grid>
  );
}

export default Chat;
