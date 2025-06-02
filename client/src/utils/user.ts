export const getAvatarCharacters = (name: string) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 1)
    .toUpperCase();
