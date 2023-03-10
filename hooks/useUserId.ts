import { useMemo, useState } from "react";

const STORAGE_USER_ID = 'mind-game:user-id'

export const useUserId = (): string => useMemo(() => {
  if (typeof window === 'undefined') {
    return '';
  }

  const existingUserId = localStorage.getItem(STORAGE_USER_ID)
  if (existingUserId) {
    return existingUserId;
  }

  const userId = makeRandomId(10)

  localStorage.setItem(STORAGE_USER_ID, userId);

  return userId;
}, []);

const makeRandomId = (length: number): string => {
  const arr = new Uint8Array(Math.ceil(length / 2));
  window.crypto.getRandomValues(arr);

  return Array.from(arr, (uint8) => uint8.toString(16))
    .join("")
    .slice(0, length);
};
