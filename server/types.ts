export type PlayerId = string;
export type Card = number;

interface BaseState {
  createdAt: Date;
  updatedAt: Date;
  hostId: PlayerId;
  players: Array<{
    id: PlayerId;
    name: string;
  }>;
}

export interface LobbyState extends BaseState {
  kind: "lobby";
  kickedPlayers: PlayerId[];
}

export interface GameState extends BaseState {
  kind: "game";
  startedAt: Date;
  roundNumber: number;
  remainingLives: number;
  throwingStars: number;
  tableCards: Card[];
  discardedCards: Card[];

  hands: {
    [playerId: PlayerId]: Card[];
  };
}

export type SessionState = LobbyState | GameState;

interface BaseDTO {
  createdAt: Date;
  isHost: boolean;
  players: Array<{
    name: string;
  }>;
}

export interface LobbyDTO extends BaseDTO {
  kind: "lobby";
}

export interface GameDTO extends BaseDTO {
  kind: "game";
  roundNumber: number;
  myHand: Card[];
  tableCards: Card[];
  discardedCards: Card[];
  throwingStars: number;
  remainingLives: number;
}

export type SessionDTO = LobbyDTO | GameDTO;
