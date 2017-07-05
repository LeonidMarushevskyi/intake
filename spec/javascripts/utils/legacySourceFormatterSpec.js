import legacySourceFormatter from 'utils/legacySourceFormatter'

describe('LegacySourceFormatter', () => {
  it('returns a string including the legacy id and table if both are present', () => {
    const params = {
      legacy_friendly_id: '123-456-789',
      legacy_friendly_table: 'Client',
    }
    expect(legacySourceFormatter(params)).toEqual('Client ID 123-456-789 in CWS-CMS')
  })

  it('returns a string including the legacy when there is no id', () => {
    const params = {
      legacy_friendly_table: 'Client',
    }
    expect(legacySourceFormatter(params)).toEqual('Client in CWS-CMS')
  })

  it('returns an empty string when there is no legacy id nor legacy table', () => {
    const params = {}
    expect(legacySourceFormatter(params)).toEqual('')
  })
})
