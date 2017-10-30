import {nWords} from 'utils/textFormatter'

describe('nWords', () => {
  const ntimes = (n) => Array.from(Array(n).keys())
  const fourWords = ntimes(4).map(() => 'word').join(' ')
  const threeWords = ntimes(3).map(() => 'word').join(' ')
  const twoWords = ntimes(2).map(() => 'word').join(' ')

  describe('when the number of words is greater than n', () => {
    it('returns n words followed by ...', () => {
      expect(nWords(fourWords, 3)).toEqual(
        `${threeWords}...`
      )
    })
  })

  describe('when the number of words is less than n', () => {
    it('returns text provided', () => {
      expect(nWords(twoWords, 3)).toEqual(twoWords)
    })
  })

  describe('when the number of words is equal to n', () => {
    it('returns text provided', () => {
      expect(nWords(threeWords, 3)).toEqual(threeWords)
    })
  })

  it('returns null if the text is null', () => {
    expect(nWords(null, 1)).toEqual(null)
  })

  it('returns undefined if the text is undefined', () => {
    expect(nWords(undefined, 1)).toEqual(undefined)
  })
})
