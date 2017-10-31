import {nWords} from 'utils/textFormatter'

describe('nWords', () => {
  const threeWords = 'word word word'

  describe('when the number of words is greater than n', () => {
    const fourWords = 'word word word word'
    it('returns n words followed by ...', () => {
      expect(nWords(fourWords, 3)).toEqual(
        `${threeWords}...`
      )
    })
  })

  describe('when the number of words is less than n', () => {
    const twoWords = 'word word'
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
