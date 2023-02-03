import { useState } from "react";

export const useUserId = (): string => {
  const [randomId] = useState<string>(() => makeRandomId(10));

  return randomId;
};

const makeRandomId = (length: number): string => {
  const arr = new Uint8Array(Math.ceil(length / 2));
  window.crypto.getRandomValues(arr);

  return Array.from(arr, (uint8) => uint8.toString(16))
    .join("")
    .slice(0, length);
};
