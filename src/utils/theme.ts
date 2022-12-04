import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const breakpoints = {
  sm: "320px",
  md: "850px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1536px",
};

const theme = extendTheme({ config, breakpoints });

export default theme;
