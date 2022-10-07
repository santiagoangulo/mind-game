import { ColorMode } from "@chakra-ui/react";

export const modalColor = <T>(
  colorMode: ColorMode,
  light: T extends string ? T : never,
  dark: T extends string ? T : never
): T => (colorMode === "light" ? light : dark);

export const partition = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): [matching: T[], nonMatching: T[]] => {
  const matching: T[] = [];
  const nonMatching: T[] = [];

  array.forEach((value, index, array) => {
    predicate(value, index, array)
      ? matching.push(value)
      : nonMatching.push(value);
  });

  return [matching, nonMatching];
};
