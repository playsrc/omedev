import {
  Flex,
  Image,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

function Header() {
  /**
   * TODO: Add a small button to toggle between dark/light mode
   * const { toggleColorMode } = useColorMode();
   */
  const headerBackgroundColor = useColorModeValue("white", "gray.700");

  return (
    <Flex
      width="100%"
      height={{ base: "auto", md: "20" }}
      boxShadow="lg"
      py={"3"}
      px={"5"}
      direction={{ base: "column", md: "row" }}
      alignItems="center"
      as="header"
      backgroundColor={headerBackgroundColor}
    >
      <Flex gap={2}>
        <Image src="/icon.png" alt="" blockSize={"14"} />
        <Image src="/logo.png" alt="" blockSize={"14"} />
      </Flex>
      <Flex ml={{ base: "unset", md: "20" }} my="1" alignItems="center">
        <Text
          fontWeight={"bold"}
          fontSize="2xl"
          sx={{ transform: "rotate(-4deg)" }}
        >
          Talk to Developers!
        </Text>
      </Flex>
      <Flex ml={"auto"} display={{ base: "none", md: "unset" }}>
        <Text fontSize={"4xl"} fontWeight="bold" textColor={"blue.400"}>
          10{" "}
          <Text
            as="span"
            fontSize={"2xl"}
            fontWeight={"normal"}
            textColor="blue.200"
          >
            online now
          </Text>
        </Text>
      </Flex>
    </Flex>
  );
}

export default Header;
