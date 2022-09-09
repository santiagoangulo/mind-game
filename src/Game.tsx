import { useEffect, useMemo, useState } from "react";
import {
  Heading,
  Button,
  Text,
  VStack,
  HStack,
  Center,
  Tag,
} from "@chakra-ui/react";

type GameStatus = "progress" | "round-finished" | "game-finished" | "game-lost";

type Card = number;

type Hand = Card[];
type TableCards = Card[];

/** Gets a hand of sorted cards for each player in the game. */
const makePlayersHands = (playerCount: number, roundNumber: number): Hand[] => {
  /* I'd like to create a "shuffled" pack of cards. First the pack,
    then the shuffled one we will be drawing cards in order to each player each round. */

  const pack = Array.from(Array(100))
    .map((_, i) => i + 1)
    .sort(() => Math.random() - 0.5);

  const playersHands: Hand[] = [];

  for (let i = 0; i < playerCount; i++) {
    const sortedHand = pack.splice(0, roundNumber).sort((a, b) => a - b);

    playersHands.push(sortedHand);
  }

  return playersHands;
};

interface GameProps {
  players: string[];
  onRestartGame: () => void;
}

export const Game: React.FC<GameProps> = ({ players, onRestartGame }) => {
  const maxRoundCount = useMemo(
    () =>
      ({
        [2]: 12,
        [3]: 10,
        [4]: 8,
      }[players.length] ?? 8),
    [players]
  );

  const [numberLives, setNumberLives] = useState<number>(players.length);

  const [tableCards, setTableCards] = useState<TableCards>([]);

  const [roundNumber, setRoundNumber] = useState<number>(1);

  const [playersHands, setPlayersHands] = useState<Hand[]>(
    makePlayersHands(players.length, roundNumber)
  );

  /** Whether the last placed card is high than any held card. */
  const isLastCardWrong: boolean = useMemo(() => {
    if (tableCards.length === 0) {
      return false;
    }

    const lastCardPlaced = tableCards[tableCards.length - 1];

    return playersHands.flat().some((x) => x < lastCardPlaced);
  }, [tableCards, playersHands]);

  // when a card is incorrectly placed, the team loses a life
  useEffect(() => {
    if (isLastCardWrong) {
      setNumberLives(numberLives - 1);
    }
  }, [isLastCardWrong]);

  const gameStatus = useMemo(() => {
    if (tableCards.length === 0) {
      return "progress";
    }

    if (numberLives === -1) {
      return "game-lost";
    }

    const allPlayerCards = playersHands.flat();

    // when all cards have been placed, the round is finished
    if (allPlayerCards.length === 0) {
      return roundNumber < maxRoundCount ? "round-finished" : "game-finished";
    }

    if (isLastCardWrong) {
      return "round-finished";
    }

    return "progress";
  }, [playersHands, roundNumber, maxRoundCount, tableCards, numberLives]);

  const placeCard = (playerIndex: number) => {
    // take the card out of players hand
    const [cardToPlace, ...activePlayerCards] = playersHands[playerIndex];

    const newPlayersHands = [
      ...playersHands.slice(0, playerIndex), // [1,2],[3,4]
      activePlayerCards, // [6]
      ...playersHands.slice(playerIndex + 1), // [7,8]
    ];

    // add to the top of the cards on the table
    const newTableCards = [...tableCards, cardToPlace];

    setPlayersHands(newPlayersHands);
    setTableCards(newTableCards);
  };

  const nextRound = () => {
    setTableCards([]);

    const nextRoundNumber = roundNumber + 1;

    setRoundNumber(nextRoundNumber);
    setPlayersHands(makePlayersHands(players.length, nextRoundNumber));
  };

  return (
    <Center py={10}>
      <VStack maxW={500} rowGap={5} alignItems="start" rounded={5}>
        <VStack gap={3} alignItems="start"></VStack>
        <Heading size="md">
          Round {roundNumber} - (Game Status: {gameStatus})
        </Heading>
        <ul>
          {players.map((name, index) => (
            <VStack
              maxW={500}
              // spacing={10}}
              rowGap={2}
              alignItems="start"
              rounded={0}
            >
              <div key={name}>
                <HStack spacing={10}>
                  <Text>
                    Player {index + 1} is {name} with cards:{" "}
                  </Text>
                  <Tag colorScheme="teal" variant="subtle">
                    {playersHands[index].join(", ")}
                  </Tag>
                </HStack>
                <Button
                  colorScheme="teal"
                  variant="ghost"
                  onClick={() => placeCard(index)}
                  disabled={
                    gameStatus !== "progress" ||
                    playersHands[index].length === 0
                  }
                >
                  Place Card
                </Button>
              </div>
            </VStack>
          ))}
          <VStack rowGap={4}>
            <p>
              This game has <Tag>{players.length}</Tag> players
            </p>
            <p>
              This game has <Tag>{maxRoundCount}</Tag> rounds
            </p>
            <p>
              <Tag>{Math.max(0, numberLives)}</Tag> lives remaining
            </p>
            <p>
              The cards on the table are: <Tag>{tableCards.join(", ")}</Tag>
            </p>
          </VStack>
        </ul>
        <HStack>
          <Button
            colorScheme="teal"
            variant="solid"
            aria-label="Next Round"
            onClick={nextRound}
            disabled={gameStatus !== "round-finished"}
          >
            Next Round
          </Button>

          <Button
            colorScheme="teal"
            variant="solid"
            aria-label="Next Round"
            onClick={onRestartGame}
            disabled={gameStatus !== "game-lost"}
          >
            Start New Game
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
};
