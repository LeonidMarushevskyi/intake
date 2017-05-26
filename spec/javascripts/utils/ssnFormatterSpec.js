import ssnFormatter from 'utils/ssnFormatter'

describe('ssnFormatter', () => {
  it('processes undefined', () => {
    expect(ssnFormatter(undefined)).toEqual('')
  })
  it('processes an empty string', () => {
    expect(ssnFormatter('')).toEqual('')
  })

  it('processes a non-formatted ssn with dashes', () => {
    expect(ssnFormatter('123456789')).toEqual('123-45-6789')
  })

  it('processes a fromatted ssn', () => {
    expect(ssnFormatter('123-45-6789')).toEqual('123-45-6789')
  })

  describe('with a partial ssn', () => {
    it('processes formatted ssn with leading gaps', () => {
      expect(ssnFormatter('___-45-6789')).toEqual('   -45-6789')
    })

    it('processes formatted ssn with gaps in the middle', () => {
      expect(ssnFormatter('12_-_5-6789')).toEqual('12 - 5-6789')
    })

    it('processes formatted ssn with trailing gaps', () => {
      expect(ssnFormatter('123-45-67__')).toEqual('123-45-67  ')
    })
  })
})
