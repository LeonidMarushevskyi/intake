import dateFormatter from 'utils/dateFormatter'

describe('dateFormatter', () => {
  it('returns empty string when passed undefined', () => {
    expect(dateFormatter(undefined)).toEqual('')
  })

  it('returns empty string when passed null', () => {
    expect(dateFormatter(null)).toEqual('')
  })

  it('returns empty string when passed empty string', () => {
    expect(dateFormatter('')).toEqual('')
  })

  it("displays date in 'MM/DD/YYYY' when passed date in format 'YYYY-MM-DD'", () => {
    expect(dateFormatter('2011-01-21')).toEqual('01/21/2011')
  })
})
