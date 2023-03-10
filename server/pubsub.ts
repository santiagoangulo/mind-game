import EventEmitter from "node:events";
import { SessionState } from "./types";

const ee = new EventEmitter();

const sessionUpdateEventName = (sessionId: string) => `session/${sessionId}`;

export const publishSessionUpdate = (
  sessionId: string,
  session: SessionState
) => {
  const eventName = sessionUpdateEventName(sessionId);
  ee.emit(eventName, session);
};

export const subscribeSessionUpdate = (
  sessionId: string,
  listener: (session: SessionState) => void
) => {
  const eventName = sessionUpdateEventName(sessionId);

  ee.on(eventName, listener);

  return {
    unsubscribe: () => ee.off(eventName, listener),
  };
};
