import crypto from "node:crypto";

type PlayerId = string;
type Card = number;

interface _Session<TSessionStatus extends "lobby" | "started"> {
  createdAt: Date;
  updatedAt: Date;

  status: TSessionStatus;

  hostId: PlayerId;
  players: Array<{
    id: PlayerId;
    name: string;
  }>;
}

interface Lobby extends _Session<"lobby"> {
  kickedPlayers: PlayerId[];
}

interface Game extends _Session<"started"> {
  roundNumber: number;

  remainingLives: number;
  throwingStars: number;
  tableCards: Card[];
  discardedCards: Card[];

  hands: {
    [playerId: PlayerId]: Card[];
  };
}

type Session = Lobby | Game;

const sessions: { [sessionId: string]: Session } = {};

const makeRandomId = () => crypto.randomBytes(10).toString("hex");

// called to host a new game
export const createLobby = ({
  userId,
  userName,
}: {
  userId: PlayerId;
  userName: string;
}) => {
  const newLobby: Lobby = {
    createdAt: new Date(),
    updatedAt: new Date(),
    hostId: userId,
    status: "lobby",
    kickedPlayers: [],
    players: [
      {
        id: userId,
        name: userName,
      },
    ],
  };

  const sessionId = makeRandomId();

  sessions[sessionId] = newLobby;

  return {
    sessionId,
  };
};

export const joinLobby = ({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId: string;
}) => {
  const session = sessions[sessionId];

  // validate game hasn't yet started
  if (session.status !== "lobby") {
    throw new Error("The game has already started so you're not able to join.");
  }

  // check whether player is kicked and return error if so
  if (session.kickedPlayers.includes(userId)) {
    throw new Error("You've been kicked from the lobby, tough luck!");
  }

  // cap the number of players in lobby

  // verify player isn't already added to the lobby
  if (!session.players.find((x) => x.id === userId)) {
    const playerNumber = session.players.length + 1;
    const initialName = `Player ${playerNumber}`;

    session.players.push({
      id: userId,
      name: userName,
    });
  }
};

export const modifyLobbyPlayerName = ({ sessionId }) => {
  // prevent from changing to an existing name
};
