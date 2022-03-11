import { useMemo, useReducer, useState } from "react";

interface GameProps {
  players: string[];
}

interface Game {
  playerCards: number[][];
  tableCards: number[];
}

type GameAction = {
  type: "PlaceCard";
  playerIndex: number;
};

const gameReducer = (game: Game, action: GameAction) => {
  switch (action.type) {
    case "PlaceCard":
      const [cardToPlace, ...activePlayerCards] =
        game.playerCards[action.playerIndex];

      const tableCards = [...game.tableCards, cardToPlace];

      return {
        ...game,
        tableCards,
        playerCards: [
          ...game.playerCards.slice(0, action.playerIndex), // [1,2],[3,4]
          activePlayerCards, // [6]
          ...game.playerCards.slice(action.playerIndex + 1), // [7,8]
        ],
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

  const [{ tableCards, playerCards }, dispatchGameAction] = useReducer(
    gameReducer,
    {
      tableCards: [],
      playerCards: players.map(() => pack.splice(0, currentRound).sort()),
    }
  );

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
        <p>We are at round {currentRound}</p>

        {players.map((name, index) => (
          <>
            <li key={name}>
              Player {index} is {name} and they {playerCards[index].join(", ")}
            </li>
            <button
              onClick={() =>
                dispatchGameAction({
                  type: "PlaceCard",
                  playerIndex: index,
                })
              }
              disabled={playerCards[index].length === 0}
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
