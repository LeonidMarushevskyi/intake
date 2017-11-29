import userNameFormatter from 'utils/userNameFormatter'

describe('userNameFormatter', () => {
  it('returns a full name when first and last are provided', () => {
    expect(userNameFormatter({
      first_name: 'Ikora',
      last_name: 'Rey',
    })).toEqual('Ikora Rey')
  })

  it('returns unknown first and provided last name', () => {
    expect(userNameFormatter({
      last_name: 'Rey',
    })).toEqual('(Unknown first name) Rey')
  })

  it('returns provided first and unknown last', () => {
    expect(userNameFormatter({
      first_name: 'Ikora',
    })).toEqual('Ikora (Unknown last name)')
  })

  it('returns "Not Available" when first and last are not provided', () => {
    expect(userNameFormatter({}))
      .toEqual('Not Available')
  })
})