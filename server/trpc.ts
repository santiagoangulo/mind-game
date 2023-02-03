import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { sessions } from "./state";

const t = initTRPC.create();

export const router = t.router;

export const publicProcedure = t.procedure;

/**
 * A procedure relating to a particular session.
 * The base for all Mind Game procedures.
 */
export const sessionProcedure = t.procedure
  .input(
    z.object({
      sessionId: z.string(),
    })
  )
  .use(({ input, next }) => {
    const session = sessions.get(input.sessionId);

    if (!session) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The specified session does not exist.",
      });
    }

    return next({
      ctx: {
        session,
      },
    });
  });

/** A procedure for a session which the user is already a part of. */
export const sessionPlayerProcedure = sessionProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .use(({ ctx, input, next }) => {
    const sessionPlayer = ctx.session.players.find(
      (x) => x.id === input.userId
    );

    if (!sessionPlayer) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a part of this session.",
      });
    }

    const isHost = ctx.session.hostId === input.userId;

    return next({
      ctx: {
        isHost,
      },
    });
  });

/** A procedure for a session in which the user is the host. */
export const sessionHostProcedure = sessionPlayerProcedure.use(
  ({ ctx, next }) => {
    if (!ctx.isHost) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must be the session host to perform this operation.",
      });
    }

    return next();
  }
);
