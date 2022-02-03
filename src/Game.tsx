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

  return (
    <>
      {players.map((x, i) => (
        <span key={i}>{x}</span>
      ))}
    </>
  );
};
