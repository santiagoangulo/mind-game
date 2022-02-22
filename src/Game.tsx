import { useMemo, useState } from "react";

interface GameProps {
  players: string[];
}

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

  const pack = Array.from(Array(100))
    .map((_, i) => i + 1)
    .sort(() => Math.random() - 0.5);

  const playerCards = players.map(() => pack.splice(0, currentRound).sort());

  const [tableCards, setTableCards] = useState<number[]>([]);

  const placeCard = (playerIndex: number) =>
    setTableCards([...tableCards, ...playerCards[playerIndex].splice(0, 1)]);

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
          <li key={name}>
            Player {index} is {name} and they {playerCards[index].join(", ")}
          </li>
        ))}
        <li>This game has {players.length} players</li>
        <li>This game has {numberOfRounds} rounds</li>
      </ul>
      <ul>
        <li>The remaining pack of cards is: {pack.join(", ")}</li>
      </ul>
    </>
  );
};
