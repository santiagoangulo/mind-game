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
import { Game } from "./game/[gameId]";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Layout } from "../components/Layout";

const App: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(App);
