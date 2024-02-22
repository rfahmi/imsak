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

export const searchKeyword = (keyword: string, text: string) => {
  // Create a regular expression with the keyword and the "i" flag for case-insensitive search
  const regex = new RegExp(keyword, 'i');
  // Test if the keyword matches the text
  // console.log(keyword, text, regex.test(text));
  return regex.test(text);
};
