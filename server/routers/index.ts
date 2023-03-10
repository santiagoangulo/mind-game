import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { initialUserName } from "../../utils/initialUserName";
import { publishSessionUpdate, subscribeSessionUpdate } from "../pubsub";
import { sessions } from "../state";
import {
  publicProcedure,
  router,
  sessionHostProcedure,
  sessionPlayerProcedure,
  sessionProcedure,
} from "../trpc";
import { GameState, LobbyState, SessionDTO, SessionState } from "../types";
import { makeRandomId } from "../utils";

export const appRouter = router({
  createSession: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        userName: z.string().nullish(),
      })
    )
    .mutation(({ input }) => {
      const newLobby: LobbyState = {
        createdAt: new Date(),
        updatedAt: new Date(),
        hostId: input.userId,
        kind: "lobby",
        kickedPlayers: [],
        players: [
          {
            id: input.userId,
            name: input.userName ?? initialUserName(),
          },
        ],
      };

      const sessionId = makeRandomId(5);

      sessions.set(sessionId, newLobby);

      return {
        sessionId,
      };
    }),

  kickPlayer: sessionHostProcedure
    .input(
      z.object({
        targetUserId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      // validate lobby only
      if (ctx.session.kind !== "lobby") {
        throw new TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "This operation is only supported in a lobby.",
        });
      }

      // validate user isn't trying to kick themselves
      if (input.targetUserId === input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are the host, you cannot kick yourself.",
        });
      }

      const updatedSession: LobbyState = {
        ...ctx.session,
        players: ctx.session.players.filter((x) => x.id !== input.targetUserId),
        kickedPlayers: [...ctx.session.kickedPlayers, input.targetUserId],
      };

      sessions.set(input.sessionId, updatedSession);
      publishSessionUpdate(input.sessionId, updatedSession);
    }),

  joinSession: sessionProcedure
    .input(
      z.object({
        userId: z.string(),
        userName: z.string().nullish(),
      })
    )
    .mutation(({ input, ctx }) => {
      // noop if already joined
      if (ctx.session.players.find((x) => x.id === input.userId)) {
        return;
      }

      // validate game hasn't already started
      if (ctx.session.kind !== "lobby") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "The game has already started without you!",
        });
      }

      // validate player hasn't been kicked
      if (ctx.session.kickedPlayers.includes(input.userId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You've been kicked from the lobby, tough luck!",
        });
      }

      ctx.session.players.push({
        id: input.userId,
        name: input.userName ?? initialUserName(),
      });

      publishSessionUpdate(input.sessionId, ctx.session);
    }),

  listenSession: sessionPlayerProcedure.subscription(({ ctx, input }) => {
    const getSessionDTO = (session: SessionState): SessionDTO => {
      const players = ctx.isHost
        ? session.players.map(({ id, name }) => ({
          id,
          name,
        }))
        : session.players.map(({ name }) => ({ name }));

      if (session.kind === "lobby") {
        return {
          createdAt: session.createdAt,
          isHost: ctx.isHost,
          players: players,
          kind: "lobby",
        };
      }

      return {
        createdAt: session.createdAt,
        isHost: ctx.isHost,
        players: players,
        kind: "game",
        roundNumber: session.roundNumber,
        myHand: session.hands[input.userId],
        tableCards: session.tableCards,
        discardedCards: session.discardedCards,
        throwingStars: session.throwingStars,
        remainingLives: session.remainingLives,
      };
    };

    return observable<SessionDTO>((emit) => {
      const subscription = subscribeSessionUpdate(
        input.sessionId,
        (session) => {
          const dto = getSessionDTO(session);
          emit.next(dto);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    });
  }),

  startGame: sessionHostProcedure.mutation(({ ctx, input }) => {
    // noop if game has already started
    if (ctx.session.kind === "game") {
      return;
    }

    // validate the number of players
    if (ctx.session.players.length > 4 || ctx.session.players.length < 2) {
      throw new TRPCError({
        code: "METHOD_NOT_SUPPORTED",
        message: "To start, you must have between two and four players.",
      });
    }

    const session = ctx.session;

    const game: GameState = {
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      hostId: session.hostId,
      players: session.players,
      kind: "game",
      startedAt: new Date(),
      roundNumber: 1,
      remainingLives: session.players.length,
      throwingStars: 1,
      tableCards: [],
      discardedCards: [],
      hands: Object.fromEntries(session.players.map(({ id }) => [id, []])),
    };

    sessions.set(input.sessionId, game);
    publishSessionUpdate(input.sessionId, game);
  }),
});

export type AppRouter = typeof appRouter;
