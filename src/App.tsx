import React, { useMemo, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Game } from "./Game";
import { SetupGame } from "./SetupGame";
import { ChakraProvider } from "@chakra-ui/react";

const App: React.FC = () => {
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);

  const [players, setPlayers] = useState<string[]>(["James", "Santi", "Kamil"]);

  return (
    <ChakraProvider>
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
    </ChakraProvider>
  );
};

export default App;

// Add button (X) to the right of each player will remove that player from the game
// Create a game > Changes the view to a in Game view
// - Uses the players List to create a game.
// - I can not modify list of players when game is created
// - I can start the game by pressing [Start Game] button.
// - At round i (1..n) where n depend on P = no of Players (8 till 12). Each player receives i cards.
