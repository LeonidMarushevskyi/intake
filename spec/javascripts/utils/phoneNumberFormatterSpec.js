import {phoneNumberFormatter} from 'utils/phoneNumberFormatter'

describe('phoneNumberFormatter ', () => {
  it('processes an empty string', () => {
    expect(phoneNumberFormatter('')).toEqual(null)
  })
  it('should return formatted number when given a 10 digit number', () => {
    expect(phoneNumberFormatter('1234567890')).toEqual('(123)456-7890')
  })
  it('should return null when given a 5 digit number', () => {
    expect(phoneNumberFormatter('12345')).toEqual(null)
  })
  it('should return null when given a 11 digit number', () => {
    expect(phoneNumberFormatter('12345678901')).toEqual(null)
  })
  it('should return null when used alphabets', () => {
    expect(phoneNumberFormatter('abcd')).toEqual(null)
  })
})