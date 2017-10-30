export const nWords = (text, numberOfWords) => {
  const delimited = text && text.split(' ')
  if (text && delimited.length > numberOfWords) {
    return delimited
      .slice(0, numberOfWords)
      .join(' ')
      .concat('...')
  } else {
    return text
  }
}
