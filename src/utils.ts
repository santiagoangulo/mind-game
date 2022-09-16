import { ColorMode } from "@chakra-ui/react";

export const modalColor = <T>(
  colorMode: ColorMode,
  light: T extends string ? T : never,
  dark: T extends string ? T : never
): T => (colorMode === "light" ? light : dark);
