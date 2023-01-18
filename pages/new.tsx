import React, { useState } from "react";
import { Button, VStack, Input, useColorMode } from "@chakra-ui/react";
import { modalColor } from "../utils";
import { useRouter } from "next/router";

const NewGamePage: React.FC = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const [playerNameInput, setPlayerNameInput] = useState<string>("");
  const isPlayerValid = () => playerNameInput.length > 0;

  const createGame = () => {
    // call the backend to create game
    // redirect host to lobby with gameId from backend
    // once joined lobby, backend can verify host is the host

    router.push("/lobby/saiojaoifjoa");
  };

  return (
    <VStack
      w="sm"
      p={5}
      bgColor={modalColor(colorMode, "white", "whiteAlpha.300")}
      shadow="lg"
      rounded={10}
      borderWidth={1}
      rowGap={8}
      alignItems="start"
    >
      <Input
        placeholder="Player Name"
        value={playerNameInput}
        onInput={(e) => setPlayerNameInput(e.currentTarget.value)}
        onKeyUp={(e) => e.key === "Enter" && createGame()}
      />

      <Button
        alignSelf="flex-end"
        colorScheme="teal"
        onClick={() => createGame()}
        isDisabled={!isPlayerValid()}
      >
        Create Game
      </Button>
    </VStack>
  );
};

export default NewGamePage;
