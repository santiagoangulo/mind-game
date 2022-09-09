import React, { useMemo, useState } from "react";
import {
  IconButton,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  Center,
  Stack,
  Heading,
  Container,
  Box,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

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
  const [playerNameInput, setPlayerNameInput] = useState<string>("");

  const hasMaxPlayers = useMemo(() => players.length >= 4, [players]);

  const hasEnoughPlayers = useMemo(() => players.length >= 2, [players]);

  const addPlayerName = () => {
    if (hasMaxPlayers) {
      return;
    }

    setPlayers([...players, playerNameInput]);
    setPlayerNameInput("");
  };

  const removePlayerName = (index: number) => {
    setPlayers([...players.slice(0, index), ...players.slice(index + 1)]);
  };

  return (
    <VStack h="100vh" py={20} background="teal.400" gap={5}>
      <Heading size="2xl" color="white">
        The Mind 🧠
      </Heading>

      <Box w={400} rounded={10} p={5} bgColor="white" shadow="lg">
        <VStack rowGap={5} alignItems="start">
          <VStack gap={3} alignItems="start">
            {players.map((name, index) => (
              <HStack key={name} gap={3}>
                <Text>{name}</Text>

                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Remove player"
                  onClick={() => removePlayerName(index)}
                />
              </HStack>
            ))}
          </VStack>

          {/* <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup> */}

          <InputGroup gap={2} flexDirection="row" alignItems="baseline">
            <Input
              placeholder="Player Name"
              value={playerNameInput}
              onInput={(e) => setPlayerNameInput(e.currentTarget.value.trim())}
              disabled={hasMaxPlayers}
            />

            <InputRightElement>
              <IconButton
                size="sm"
                icon={<AddIcon />}
                onClick={addPlayerName}
                disabled={hasMaxPlayers}
                aria-label="Add Player"
              />
            </InputRightElement>
          </InputGroup>

          {hasEnoughPlayers && (
            <Button colorScheme="teal" variant="solid" onClick={onStartGame}>
              Start Game
            </Button>
          )}
        </VStack>
      </Box>
    </VStack>
  );
};
