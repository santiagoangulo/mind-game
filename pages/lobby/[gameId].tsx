import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  StackDivider,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { modalColor } from "../../utils";

export const GameLobbyPage = () => {
  const router = useRouter();

  // from the backend
  const [players, setPlayers] = useState<
    {
      id: string;
      name: string;
    }[]
  >([
    {
      id: "oiewfjoiwjfw",
      name: "Santi",
    },
    {
      id: "oiwejfoiwjefo",
      name: "Bogdan",
    },
  ]);

  const copyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
  };

  const kickPlayer = (playerId: string) => {};

  const onStartGame = () => {
    router.replace("/game/joiadjoaisjd");
  };

  // from the backend
  const hostName = "James";

  const { colorMode } = useColorMode();

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
      <HStack w="full" justifyContent="space-between">
        <Text>Game ID: {router.query.gameId}</Text>
        <Button onClick={() => copyLink()}>Share Link</Button>
      </HStack>

      <Text>Your host is: {hostName}</Text>

      <VStack w="full" alignItems="start" divider={<StackDivider />}>
        {players.map((player) => (
          <HStack key={player.id} w="full" justifyContent="space-between">
            <Text fontWeight="medium">{player.name}</Text>

            <IconButton
              aria-label="Remove player"
              icon={<DeleteIcon />}
              variant="ghost"
              onClick={() => kickPlayer(player.id)}
            />
          </HStack>
        ))}
      </VStack>

      <Button w="full" colorScheme="teal" onClick={() => onStartGame()}>
        Start Game
      </Button>
    </VStack>
  );
};

export default GameLobbyPage;
