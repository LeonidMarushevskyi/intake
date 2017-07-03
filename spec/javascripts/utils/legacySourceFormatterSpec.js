import Immutable from 'immutable'
import legacySourceFormatter from 'utils/legacySourceFormatter'

describe('LegacySourceFormatter', () => {
  it('renders the participant legacy id and table', () => {
    const legacyObject = Immutable.fromJS({
      legacy_friendly_id: '123-456-789',
      legacy_friendly_table: 'Client',
    })
    expect(legacySourceFormatter(legacyObject)).toEqual('Client ID 123-456-789 in CWS-CMS')
  })

  it('renders the participant legacy table when there is no id', () => {
    const legacyObject = Immutable.fromJS({
      legacy_friendly_table: 'Client',
    })
    expect(legacySourceFormatter(legacyObject)).toEqual('Client in CWS-CMS')
  })

  it('renders properly when there is no legacy id nor legacy table', () => {
    const legacyObject = Immutable.Map()
    expect(legacySourceFormatter(legacyObject)).toEqual('')
  })
})
