import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { PusherProvider } from "../context/pusherContext";
import theme from "../utils/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <PusherProvider>
        <Component {...pageProps} />
      </PusherProvider>
    </ChakraProvider>
  );
}
