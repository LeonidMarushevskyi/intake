import {fromJS} from 'immutable'
import {
  getStatusValueSelector,
  getPurposeValueSelector,
  getLocationValueSelector,
  getCommunicationMethodValueSelector,
} from 'selectors/contactSelectors'

describe('getStatusValueSelector', () => {
  const contactStatuses = [{code: 'A', value: 'Attempted'}]

  it('returns the current contact status display value', () => {
    const contact = {status: {value: 'A'}}
    const state = fromJS({contact, contactStatuses})
    expect(getStatusValueSelector(state)).toEqual('Attempted')
  })

  it('returns undefined when contact does not have a status', () => {
    const contact = {status: {value: null}}
    const state = fromJS({contact, contactStatuses})
    expect(getStatusValueSelector(state)).toEqual(undefined)
  })
})

describe('getPurposeValueSelector', () => {
  const contactPurposes = [{code: '123', value: 'SomePurpose'}]

  it('returns the current contact purpose display value', () => {
    const contact = {purpose: {value: '123'}}
    const state = fromJS({contact, contactPurposes})
    expect(getPurposeValueSelector(state)).toEqual('SomePurpose')
  })

  it('returns undefined when contact does not have a purpose', () => {
    const contact = {purpose: {value: null}}
    const state = fromJS({contact, contactPurposes})
    expect(getPurposeValueSelector(state)).toEqual(undefined)
  })
})

describe('getLocationValueSelector', () => {
  const locations = [{code: '444', value: 'school'}]

  it('returns the current contact location display value', () => {
    const contact = {location: {value: '444'}}
    const state = fromJS({contact, locations})
    expect(getLocationValueSelector(state)).toEqual('school')
  })

  it('returns undefined when contact does not have a location', () => {
    const contact = {location: {value: null}}
    const state = fromJS({contact, locations})
    expect(getLocationValueSelector(state)).toEqual(undefined)
  })
})

describe('getCommunicationMethodValueSelector', () => {
  const communicationMethods = [{code: '555', value: 'Phone'}]

  it('returns the current contact communication methods display value', () => {
    const contact = {communication_method: {value: '555'}}
    const state = fromJS({contact, communicationMethods})
    expect(getCommunicationMethodValueSelector(state)).toEqual('Phone')
  })

  it('returns undefined when contact does not have a communication method', () => {
    const contact = {communication_method: {value: null}}
    const state = fromJS({contact, communicationMethods})
    expect(getCommunicationMethodValueSelector(state)).toEqual(undefined)
  })
})

