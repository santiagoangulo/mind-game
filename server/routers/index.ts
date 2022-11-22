import { z } from "zod";
import { publicProcedure, router } from "../trpc";

/* const games = [
  {
    players: 
  }
];*/

// Game creation page: app.co.uk/new
// host creates game
// host copies link and sends to other players for them to join
// Game joining page: app.co.uk/join/gameId
// player opens link, sets their name and gameId, then joins the game


export const appRouter = router({
  // createLobby - accepts player id generated on client
  // joinLobby - accepts gameId, playerId?, playerName?
  // startGame

  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    }),
  registerGame: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      return {
        gameId: `hello ${input?.text ?? "world"}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
