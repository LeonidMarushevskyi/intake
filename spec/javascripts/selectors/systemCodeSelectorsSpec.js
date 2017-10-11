import {
  getInPersonCommunicationMethodValueSelector,
  getOfficeLocationCodeValueSelector,
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
