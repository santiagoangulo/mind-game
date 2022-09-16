import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "system",
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: mode("teal.500", "blackAlpha.100")(props),
    },
  }),
};

export const theme = extendTheme(
  // withDefaultColorScheme({ colorScheme: "teal" }),
  {
    config,
    styles,
  }
);
