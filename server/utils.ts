import * as crypto from "node:crypto";

export const makeRandomId = (length: number) =>
  crypto.randomBytes(length).toString("hex");
