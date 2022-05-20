import { useCallback, useMemo, useState } from "react";

interface GameProps {
  players: string[];
  onRestartGame: () => void;
}

type GameStatus = "progress" | "finished" | "lost";

type Card = number;

type Hand = Card[];
type TableCards = Card[];

interface Game {
  playersHands: Hand[];
  tableCards: TableCards;
  gameStatus: GameStatus;
  onRestartGame: () => void;
}

/** Gets a hand of sorted cards for each player in the game. */
const makePlayersHands = (playerCount: number, roundNumber: number): Hand[] => {
  /* I'd like to create a "shuffled" pack of cards. First the pack,
    then the shuffled one we will be drawing cards in order to each player each round. */

  const pack = Array.from(Array(100))
    .map((_, i) => i + 1)
    .sort(() => Math.random() - 0.5);

  const playersHands: Hand[] = [];

  for (let i = 0; i < playerCount; i++) {
    const sortedHand = pack.splice(0, roundNumber).sort();

    playersHands.push(sortedHand);
  }

  return playersHands;
};

export const Game: React.FC<GameProps> = ({ players, onRestartGame }) => {
  const numberOfRounds = useMemo(
    () =>
      ({
        [2]: 12,
        [3]: 10,
        [4]: 8,
      }[players.length]),
    [players]
  );

  const [gameStatus, setGameStatus] = useState<GameStatus>("progress");

  const [tableCards, setTableCards] = useState<TableCards>([]);

  const [roundNumber, setRoundNumber] = useState<number>(1);

  const [playersHands, setPlayersHands] = useState<Hand[]>(
    makePlayersHands(players.length, roundNumber)
  );

  const placeCard = useCallback((playerIndex: number) => {
    // take the card out of players hand
    const [cardToPlace, ...activePlayerCards] = playersHands[playerIndex];

    const newPlayersHands = [
      ...playersHands.slice(0, playerIndex), // [1,2],[3,4]
      activePlayerCards, // [6]
      ...playersHands.slice(playerIndex + 1), // [7,8]
    ];

    // add to the top of the cards on the table
    const newTableCards = [...tableCards, cardToPlace];

    // check if placed card is higher than any cards held by the players
    const gameStatus = (() => {
      const allPlayerCards = playersHands.flat();

      if (allPlayerCards.length === 0) {
        return "finished";
      }

      const isPlacedCardHigher = allPlayerCards.some((x) => cardToPlace > x);

      if (isPlacedCardHigher) {
        return "lost";
      }

      return "progress";
    })();

    setPlayersHands(newPlayersHands);
    setTableCards(newTableCards);
    setGameStatus(gameStatus);
  }, []);

  return (
    <>
      <ul>
        <p>
          We are at round {roundNumber} (gameStatus: {gameStatus})
        </p>

        {players.map((name, index) => (
          <>
            <li key={name}>
              Player {index} is {name} with cards:{" "}
              {playersHands[index].join(", ")}
            </li>
            <button
              onClick={() => placeCard(index)}
              disabled={playersHands[index].length === 0}
            >
              Place card
            </button>
          </>
        ))}
        <li>This game has {players.length} players</li>
        <li>This game has {numberOfRounds} rounds</li>
      </ul>
      <ul>
        <li>The cards on the table are: {tableCards.join(", ")}</li>
      </ul>

      <button
        // onClick={() =>
        //   // dispatchGameAction({
        //   //   type: "PlaceCard",
        //   //   playerIndex: index,
        //   // })
        // }
        disabled={gameStatus !== "finished"}
      >
        Next Round
      </button>
      <button
        // Let's go again to SetupGame!!!
        disabled={gameStatus !== "lost"}
      >
        Start New Game
      </button>
    </>
  );
};
