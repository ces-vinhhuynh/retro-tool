export const getInitialLetter = (input: string) =>
  input
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 1)
    .toUpperCase();
