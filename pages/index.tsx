import React, { useEffect, useState } from "react";
import { Game } from "../components/Game";
import { SetupGame } from "../components/SetupGame";

import {
  Center,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const App: React.FC = () => {
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
        {hasGameStarted ? (
          <Game
            players={players}
            onRestartGame={() => setHasGameStarted(false)}
          />
        ) : (
          <SetupGame
            players={players}
            setPlayers={setPlayers}
            onStartGame={() => setHasGameStarted(true)}
          />
        )}
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

export default App;

// Add button (X) to the right of each player will remove that player from the game
// Create a game > Changes the view to a in Game view
// - Uses the players List to create a game.
// - I can not modify list of players when game is created
// - I can start the game by pressing [Start Game] button.
// - At round i (1..n) where n depend on P = no of Players (8 till 12). Each player receives i cards.
