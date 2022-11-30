import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { PusherProvider } from "../context/pusherContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <PusherProvider>
        <Component {...pageProps} />
      </PusherProvider>
    </ChakraProvider>
  );
}
