export const stringToProperCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word =>
      word.length > 3
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toUpperCase(),
    )
    .join(' ');
};
