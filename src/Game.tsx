import { useMemo, useReducer, useState } from "react";

interface GameProps {
  players: string[];
}

interface Game {
  playersHands: number[][];
  tableCards: number[];
  gameStatus: "progress" | "finished" | "lost";
}

type GameAction = {
  type: "PlaceCard";
  playerIndex: number;
};

const gameReducer: React.Reducer<Game, GameAction> = (game, action) => {
  switch (action.type) {
    case "PlaceCard":
      // take the card out of players hand
      const [cardToPlace, ...activePlayerCards] =
        game.playersHands[action.playerIndex];

      const playersHands = [
        ...game.playersHands.slice(0, action.playerIndex), // [1,2],[3,4]
        activePlayerCards, // [6]
        ...game.playersHands.slice(action.playerIndex + 1), // [7,8]
      ];

      // add to the top of the cards on the table
      const tableCards = [...game.tableCards, cardToPlace];

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

      return {
        ...game,
        playersHands,
        tableCards,
        gameStatus,
      };
  }
};

export const Game: React.FC<GameProps> = ({ players }) => {
  const numberOfRounds = useMemo(
    () =>
      ({
        [2]: 12,
        [3]: 10,
        [4]: 8,
      }[players.length]),
    [players]
  );

  const [currentRound, setCurrentRound] = useState(1);

  /* I'd like to create a "shuffled" pack of cards. First the pack,
    then the shuffled one we will be drawing cards in order to each player each round. */

  const pack = useMemo(
    () =>
      Array.from(Array(100))
        .map((_, i) => i + 1)
        .sort(() => Math.random() - 0.5),
    []
  );

  const [{ tableCards, playersHands, gameStatus }, dispatchGameAction] =
    useReducer(gameReducer, {
      gameStatus: "progress",
      tableCards: [],
      playersHands: players.map(() => pack.splice(0, currentRound).sort()),
    });

  // display current tableCards

  // make a button for each player to call placeCard

  // know whether a bad card has been placed on the table
  // then, display message saying you lose

  /* Randomize array in-place using Durstenfeld shuffle algorithm */

  /* 
  For current round R assign the first cards to each of the P players.
  Then all cards are returned to the pack before progressing to the next round.
  */

  return (
    <>
      <ul>
        <p>
          We are at round {currentRound} (gameStatus: {gameStatus})
        </p>

        {players.map((name, index) => (
          <>
            <li key={name}>
              Player {index} is {name} with cards:{" "}
              {playersHands[index].join(", ")}
            </li>
            <button
              onClick={() =>
                dispatchGameAction({
                  type: "PlaceCard",
                  playerIndex: index,
                })
              }
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
    </>
  );
};
