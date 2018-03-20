import {
  getInPersonCommunicationMethodValueSelector,
  getOfficeLocationCodeValueSelector,
  getAddressCountiesSelector,
  getRelationshipTypesSelector,
} from 'selectors/systemCodeSelectors'
import {fromJS} from 'immutable'

describe('getInPersonCommunicationMethodValueSelector', () => {
  it("returns the code value for 'In person' communication method", () => {
    const communicationMethods = [{code: '667', value: 'In person'}]
    const state = fromJS({communicationMethods})
    expect(getInPersonCommunicationMethodValueSelector(state)).toEqual('667')
  })

  it('returns undefined when communication methods are empty', () => {
    const state = fromJS({communicationMethods: []})
    expect(getInPersonCommunicationMethodValueSelector(state)).toEqual(undefined)
  })
})

describe('getOfficeLocationCodeValueSelector', () => {
  it("returns the code value for 'CWS Office' location", () => {
    const locations = [{code: 'office_location_code', value: 'CWS Office'}]
    const state = fromJS({locations})
    expect(getOfficeLocationCodeValueSelector(state)).toEqual('office_location_code')
  })

  it('returns undefined when locations are empty', () => {
    const state = fromJS({locations: []})
    expect(getOfficeLocationCodeValueSelector(state)).toEqual(undefined)
  })
})

describe('getAddressCountiesSelector', () => {
  it('return a list of address counties', () => {
    const addressCounties = [{county_code: '99', value: 'State Of California'}]
    const otherSystemCodes = [{county_code: '1', value: 'invalid'}]
    const state = fromJS({addressCounties, otherSystemCodes})
    expect(getAddressCountiesSelector(state).toJS()).toEqual(addressCounties)
  })

  it('return an empty list when address counties are empty', () => {
    const addressCounties = []
    const otherSystemCodes = [{county_code: '1', value: 'invalid'}]
    const state = fromJS({addressCounties, otherSystemCodes})
    expect(getAddressCountiesSelector(state).toJS()).toEqual([])
  })
})

describe('getRelationshipTypesSelector', () => {
  it('return a list of relationship types', () => {
    const relationshipTypes = [{county_code: '99', value: 'State Of California'}]
    const state = fromJS({relationshipTypes})
    expect(getRelationshipTypesSelector(state).toJS()).toEqual(relationshipTypes)
  })

  it('return an empty list when relationship types are empty', () => {
    const relationshipTypes = []
    const state = fromJS({relationshipTypes})
    expect(getRelationshipTypesSelector(state).toJS()).toEqual([])
  })
})
