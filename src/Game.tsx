import { useMemo } from "react";

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

  /* I'd like to create a "shuffled" pack of cards. First the pack,
    then the shuffled one we will be drawing cards in order to each player each round. */
  let packOfCards: Array<number> = [];
  for (let iter = 0; iter < 100; iter++) {
    packOfCards.push(iter + 1);
  }

  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  const shuffleArray = (array: Array<number>) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  /* 
  For current round R assign the first cards to each of the P players.
  Then all cards are returned to the pack before progressing to the next round.
  */

  return (
    <>
      <ul>
        {players.map((name, index) => (
          <>
            <li key={name}>
              Player {index} is {name}
            </li>
          </>
        ))}
        <li>This game has {players.length} players</li>
        <li>This game has {numberOfRounds} rounds</li>
      </ul>
      <ul>
        <li>The ordered pack of cards is: {packOfCards}</li>
        <li>The shuffled pack of cards is: {shuffleArray(packOfCards)}</li>
      </ul>
    </>
  );
};
