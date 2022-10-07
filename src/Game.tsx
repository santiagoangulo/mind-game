import { useEffect, useMemo, useState } from "react";
import {
  Heading,
  Button,
  Text,
  VStack,
  HStack,
  Tag,
  useColorMode,
  Icon,
} from "@chakra-ui/react";
import { modalColor, partition } from "./utils";
import { FaHeart } from "react-icons/fa";
import { produce } from "immer";

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

export const Game: React.FC<GameProps> = ({
  players,
  onRestartGame: onLeaveGame,
}) => {
  const { colorMode } = useColorMode();

  const maxRoundCount = useMemo(
    () =>
      ({
        [2]: 12,
        [3]: 10,
        [4]: 8,
      }[players.length] ?? 8),
    [players]
  );

  const [remainingLives, setNumberLives] = useState<number>(players.length);

  const [tableCards, setTableCards] = useState<TableCards>([]);

  const [roundNumber, setRoundNumber] = useState<number>(1);

  const [playersHands, setPlayersHands] = useState<Hand[]>(
    makePlayersHands(players.length, roundNumber)
  );

  // when an incorrect card has been placed, discard relevant held cards
  useEffect(() => {
    const lastCardPlaced = tableCards[tableCards.length - 1];
    const isLastCardWrong = playersHands.flat().some((x) => x < lastCardPlaced);

    if (isLastCardWrong) {
      // decrement the number of lives
      setNumberLives((lives) => lives - 1);

      // move all held cards of lower value onto table

      const discardedCards: number[] = [];

      // discard relevant held cards
      setPlayersHands(
        produce((playersHands) => {
          for (let i = 0; i < playersHands.length; i++) {
            const [newHand, toDiscard] = partition(
              playersHands[i],
              (card) => card > lastCardPlaced
            );

            playersHands[i] = newHand;
            discardedCards.push(...toDiscard);
          }
        })
      );

      // add discarded cards to table
      setTableCards((tableCards) =>
        [...tableCards, ...discardedCards].sort((a, b) => a - b)
      );
    }
  }, [tableCards, playersHands]);

  /** Infers the status of the game from the table and the cards which are being held. */
  const gameStatus: GameStatus = useMemo(() => {
    if (tableCards.length === 0) {
      return "progress";
    }

    if (remainingLives === -1) {
      return "game-lost";
    }

    const allPlayerCards = playersHands.flat();

    // when all cards have been placed, the round is finished
    if (allPlayerCards.length === 0) {
      return roundNumber < maxRoundCount ? "round-finished" : "game-finished";
    }

    return "progress";
  }, [playersHands, roundNumber, maxRoundCount, tableCards, remainingLives]);

  /** Moves the lowest value card of the specified player onto the table. */
  const placeCard = (playerIndex: number) => {
    // take the lowest value card from player
    const cardToPlace = playersHands[playerIndex][0];

    const newPlayersHands = produce(playersHands, (draft) => {
      draft[playerIndex].shift();
    });

    // add to the top of the cards on the table
    const newTableCards = [...tableCards, cardToPlace];

    setPlayersHands(newPlayersHands);
    setTableCards(newTableCards);
  };

  /** Progresses onto next round by resetting table cards and assigning fresh cards. */
  const nextRound = () => {
    setTableCards([]);

    const nextRoundNumber = roundNumber + 1;

    setRoundNumber(nextRoundNumber);
    setPlayersHands(makePlayersHands(players.length, nextRoundNumber));
  };

  return (
    <VStack
      w="sm"
      p={5}
      bgColor={modalColor(colorMode, "white", "whiteAlpha.300")}
      shadow="lg"
      rounded={10}
      borderWidth={1}
      rowGap={5}
      alignItems="stretch"
    >
      <Heading size="lg">Round {roundNumber}</Heading>
      <Heading size="sm">{gameStatus}</Heading>

      <HStack>
        <Text fontWeight="bold">Table</Text>
        {tableCards.map((card) => (
          <Tag colorScheme="teal">{card}</Tag>
        ))}
      </HStack>

      <VStack gap={3}>
        {players.map((name, index) => (
          <Button
            key={index}
            width="full"
            onClick={() => placeCard(index)}
            disabled={
              gameStatus !== "progress" || playersHands[index].length === 0
            }
          >
            <HStack spacing={1} w="full">
              <Text fontWeight="medium" mr="auto">
                {name}
              </Text>

              {playersHands[index].map((card) => (
                <Tag colorScheme="teal">{card}</Tag>
              ))}
            </HStack>
          </Button>
        ))}

        <HStack>
          {remainingLives > 0 &&
            Array.from(Array(remainingLives)).map(() => (
              <Icon as={FaHeart} color="red" />
            ))}
        </HStack>
      </VStack>

      <HStack justifyContent="space-between">
        <Button colorScheme="teal" variant="ghost" onClick={onLeaveGame}>
          Leave Game
        </Button>

        <Button
          colorScheme="teal"
          variant="solid"
          aria-label="Next Round"
          onClick={nextRound}
          disabled={gameStatus !== "round-finished"}
        >
          Next Round
        </Button>
      </HStack>
    </VStack>
  );
};
