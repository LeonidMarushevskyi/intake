import {nTimesDo} from 'utils/arrayHelper'

describe('nTimesDo', () => {
  it('performs the passed function n times', () => {
    const result = nTimesDo(3, (counter) => counter * 2)
    expect(result).toEqual([0, 2, 4])
  })
})

