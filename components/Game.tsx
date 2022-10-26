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
import { modalColor, partition } from "../utils";
import { FaHeart, FaStar } from "react-icons/fa";
import { produce } from "immer";

type GameStatus = "progress" | "round-finished" | "game-finished" | "game-lost";

type Card = number;

type SetOfCards = Card[];

/** Gets a hand of sorted cards for each player in the game. */
const makePlayersHands = (
  playerCount: number,
  roundNumber: number
): SetOfCards[] => {
  /* I'd like to create a "shuffled" pack of cards. First the pack,
    then the shuffled one we will be drawing cards in order to each player each round. */

  const pack = Array.from(Array(100))
    .map((_, i) => i + 1)
    .sort(() => Math.random() - 0.5);

  const playersHands: SetOfCards[] = [];

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

  const [throwingStars, setThrowingStars] = useState<number>(3);

  const [tableCards, setTableCards] = useState<SetOfCards>([]);

  const [roundNumber, setRoundNumber] = useState<number>(1);

  const [playersHands, setPlayersHands] = useState<SetOfCards[]>(
    makePlayersHands(players.length, roundNumber)
  );

  const [discardedCards, setDiscardedCards] = useState<SetOfCards>([]);

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
    if (remainingLives === -1) {
      return "game-lost";
    }

    const allPlayerCards = playersHands.flat();

    // when all cards have been placed, the round is finished
    if (allPlayerCards.length === 0) {
      return roundNumber < maxRoundCount ? "round-finished" : "game-finished";
    }

    return "progress";
  }, [playersHands, roundNumber, maxRoundCount, remainingLives]);

  /** The team uses a "Throwing Star" card and the lowest card of each player is discarded. */
  const onThrowingStar = () => {
    setThrowingStars((count) => count - 1);

    var newPlayersHands: SetOfCards[] = [];
    var lowestCardsToDiscard: Card[] = discardedCards;

    playersHands.forEach((eachPlayer) => {
      // Address bug when a player might have no cards.
      if (eachPlayer.length === 0) {
        newPlayersHands.push([]);
        return;
      }

      const [lowestCard, ...remainingCards] = eachPlayer;

      lowestCardsToDiscard.push(lowestCard);
      newPlayersHands.push(remainingCards);
    });

    setPlayersHands(newPlayersHands);
    setDiscardedCards(lowestCardsToDiscard.sort(ordNumber));
  };

  const ordNumber = (a: number, b: number) => a - b;

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
    setDiscardedCards([]);

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

        <HStack justifyContent="space-between" w="full">
          <Button
            disabled={gameStatus !== "progress" || throwingStars === 0}
            colorScheme="teal"
            bgColor="yellow.100"
            variant="ghost"
            aria-label="Next Round"
            onClick={onThrowingStar}
          >
            <HStack>
              <Text color="black">{throwingStars}</Text>
              <Icon as={FaStar} color="yellow.400" />
            </HStack>
          </Button>

          <HStack>
            {Array.from(Array(remainingLives)).map(() => (
              <Icon as={FaHeart} color="red" />
            ))}
          </HStack>
        </HStack>
      </VStack>
      <Text fontWeight="bold">Discarded Cards</Text>
      {discardedCards.map((card) => (
        <Tag colorScheme="teal">{card}</Tag>
      ))}
      <HStack></HStack>
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
