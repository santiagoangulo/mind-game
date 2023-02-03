import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Center,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  useEffect(() => {
    document.title = "Mind Game";
  });

  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);

  const [players, setPlayers] = useState<string[]>(["James", "Santi", "Kamil"]);

  const { toggleColorMode } = useColorMode();

  const LightDarkIcon = useColorModeValue(SunIcon, MoonIcon);
  const lightDarkLabel = useColorModeValue(
    "Switch to dark mode",
    "Switch to light mode"
  );

  return (
    <Center minH="100vh" w="100vw" py={10} px={5}>
      <VStack gap={5} direction="column">
        <Heading size="2xl" color="white">
          The Mind 🧠
        </Heading>

        {children}
      </VStack>

      <IconButton
        pos="absolute"
        top={5}
        left={5}
        colorScheme="whiteAlpha"
        variant="ghost"
        rounded="full"
        icon={<LightDarkIcon />}
        aria-label={lightDarkLabel}
        onClick={toggleColorMode}
      />
    </Center>
  );
};
