import React, { useMemo, useState } from "react";
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

interface SetupGameProps {
  players: string[];
  setPlayers: (players: string[]) => void;
  onStartGame: () => void;
}

export const SetupGame: React.FC<SetupGameProps> = ({
  players,
  setPlayers,
  onStartGame,
}) => {
  const { colorMode } = useColorMode();

  const [playerNameInput, setPlayerNameInput] = useState<string>("");

  const hasMinPlayers = useMemo(() => players.length >= 2, [players]);
  const hasMaxPlayers = useMemo(() => players.length >= 4, [players]);

  const addPlayerName = () => {
    if (!playerNameInput || hasMaxPlayers) {
      return;
    }

    setPlayers([...players, playerNameInput]);
    setPlayerNameInput("");
  };

  const removePlayerName = (index: number) => {
    setPlayers([...players.slice(0, index), ...players.slice(index + 1)]);
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
              onClick={() => removePlayerName(index)}
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
        onClick={onStartGame}
        isDisabled={!hasMinPlayers}
      >
        Start Game
      </Button>
    </VStack>
  );
};
