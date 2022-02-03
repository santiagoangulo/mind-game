import React, { useMemo, useState } from "react";

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

  const hasEnoughPlayers = useMemo(() => players.length > 1, [players]);

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
    <>
      <ul>
        {players.map((name, index) => (
          <>
            <li key={name}>{name}</li>
            <button onClick={() => removePlayerName(index)}>(x)</button>
          </>
        ))}
      </ul>

      <input
        type="text"
        value={playerNameInput}
        onInput={(e) => setPlayerNameInput(e.currentTarget.value.trim())}
        disabled={hasMaxPlayers}
      />
      <p>
        <button onClick={addPlayerName} disabled={hasMaxPlayers}>
          Add
        </button>

        <button
          onClick={() => {
            setPlayers([]);
          }}
          disabled={players.length === 0}
        >
          Clear Player List
        </button>
      </p>
      <p>
        {hasEnoughPlayers && <button onClick={onStartGame}>Start Game</button>}
      </p>
    </>
  );
};
