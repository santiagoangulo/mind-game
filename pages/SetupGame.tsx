import React, { useContext, useMemo, useState } from "react";
import {
  IconButton,
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
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { modalColor } from "../utils";
import { useGameInitStore } from "../stores/useGameInitStore";

const SetupGame: React.FC = () => {
  const { players, addPlayer, removePlayer } = useGameInitStore();

  const { colorMode } = useColorMode();

  const [playerNameInput, setPlayerNameInput] = useState<string>("");

  const hasMinPlayers = useMemo(() => players.length >= 2, [players]);
  const hasMaxPlayers = useMemo(() => players.length >= 4, [players]);

  const addPlayerName = () => {
    if (!playerNameInput || hasMaxPlayers) {
      return;
    }

    addPlayer(playerNameInput);
    setPlayerNameInput("");
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
      <VStack w="full" alignItems="start" divider={<StackDivider />}>
        {players.map((name, index) => (
          <HStack key={name} w="full" justifyContent="space-between">
            <Text fontWeight="medium">{name}</Text>

            <IconButton
              aria-label="Remove player"
              icon={<DeleteIcon />}
              variant="ghost"
              onClick={() => removePlayer(index)}
            />
          </HStack>
        ))}
      </VStack>

      <InputGroup>
        <Input
          placeholder="Player Name"
          value={playerNameInput}
          onInput={(e) => setPlayerNameInput(e.currentTarget.value)}
          onKeyUp={(e) => e.key === "Enter" && addPlayerName()}
          isDisabled={hasMaxPlayers}
        />

        <InputRightElement>
          <IconButton
            size="sm"
            icon={<AddIcon />}
            onClick={addPlayerName}
            isDisabled={!playerNameInput || hasMaxPlayers}
            aria-label="Add Player"
          />
        </InputRightElement>
      </InputGroup>

      <Button
        alignSelf="flex-end"
        colorScheme="teal"
        onClick={() => {}}
        isDisabled={!hasMinPlayers}
      >
        Start Game
      </Button>
    </VStack>
  );
};

export default SetupGame;
