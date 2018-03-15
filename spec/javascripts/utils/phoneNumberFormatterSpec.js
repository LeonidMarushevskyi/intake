import {phoneNumberFormatter} from 'utils/phoneNumberFormatter'

describe('phoneNumberFormatter ', () => {
  it('processes an empty string', () => {
    expect(phoneNumberFormatter('')).toEqual(null)
  })
  it('processes an ten digit number', () => {
    expect(phoneNumberFormatter('1234567890')).toEqual('(123)456-7890')
  })
  it('processes an 5 digit number', () => {
    expect(phoneNumberFormatter('12345')).toEqual(null)
  })
  it('processes an 11 digit', () => {
    expect(phoneNumberFormatter('12345678901')).toEqual(null)
  })
  it('processes an alphabets', () => {
    expect(phoneNumberFormatter('abcd')).toEqual(null)
  })
})