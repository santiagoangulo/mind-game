import type { AppType, AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";
import { trpc } from "../utils/trpc";
import ReactDOM from "react-dom/client";
import React, { useContext, useMemo, useState, useEffect } from "react";
import {
  Button,
  Text,
  VStack,
  HStack,
  Input,
  Box,
  InputGroup,
  InputRightElement,
  StackDivider,
  useColorMode,
  Center,
  Heading,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { modalColor } from "../utils";
import { useGameInitStore } from "../stores/useGameInitStore";
import { Game } from "../components/Game";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

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

  const helloText = trpc.hello.useQuery({
    text: "Santi",
  });

  if (!helloText.data) {
    return null;
  }

  return (
    <Center minH="100vh" w="100vw" py={10} px={5}>
      <VStack gap={5} direction="column">
        <Heading size="2xl" color="white">
          The Mind 🧠
        </Heading>
        <Heading size="2xl" color="white">
          {helloText.data.greeting}
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
