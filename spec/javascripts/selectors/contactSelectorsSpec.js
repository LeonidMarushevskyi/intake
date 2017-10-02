import {fromJS} from 'immutable'
import {
  currentStatusSelector,
  currentPurposeSelector,
  currentLocationSelector,
  currentCommunicationMethodSelector,
  inPersonCommunicationMethodSelector,
} from 'selectors/contactSelectors'

describe('currentStatusSelector', () => {
  const contactStatuses = [{code: 'A', value: 'Attempted'}]

  it('returns the current contact status display value', () => {
    const contact = {status: {value: 'A'}}
    const state = fromJS({contact, contactStatuses})
    expect(currentStatusSelector(state)).toEqual('Attempted')
  })

  it('returns undefined when contact does not have a status', () => {
    const contact = {status: {value: null}}
    const state = fromJS({contact, contactStatuses})
    expect(currentStatusSelector(state)).toEqual(undefined)
  })
})

describe('currentPurposeSelector', () => {
  const contactPurposes = [{code: '123', value: 'SomePurpose'}]

  it('returns the current contact purpose display value', () => {
    const contact = {purpose: {value: '123'}}
    const state = fromJS({contact, contactPurposes})
    expect(currentPurposeSelector(state)).toEqual('SomePurpose')
  })

  it('returns undefined when contact does not have a purpose', () => {
    const contact = {purpose: {value: null}}
    const state = fromJS({contact, contactPurposes})
    expect(currentPurposeSelector(state)).toEqual(undefined)
  })
})

describe('currentLocationSelector', () => {
  const locations = [{code: '444', value: 'school'}]

  it('returns the current contact location display value', () => {
    const contact = {location: {value: '444'}}
    const state = fromJS({contact, locations})
    expect(currentLocationSelector(state)).toEqual('school')
  })

  it('returns undefined when contact does not have a location', () => {
    const contact = {location: {value: null}}
    const state = fromJS({contact, locations})
    expect(currentLocationSelector(state)).toEqual(undefined)
  })
})

describe('currentCommunicationMethodSelector', () => {
  const communicationMethods = [{code: '555', value: 'Phone'}]

  it('returns the current contact communication methods display value', () => {
    const contact = {communication_method: {value: '555'}}
    const state = fromJS({contact, communicationMethods})
    expect(currentCommunicationMethodSelector(state)).toEqual('Phone')
  })

  it('returns undefined when contact does not have a communication method', () => {
    const contact = {communication_method: {value: null}}
    const state = fromJS({contact, communicationMethods})
    expect(currentCommunicationMethodSelector(state)).toEqual(undefined)
  })
})

describe('inPersonCommunicationMethodSelector', () => {
  it("returns the code value for 'In person' communication method", () => {
    const communicationMethods = [{code: '667', value: 'In person'}]
    const state = fromJS({communicationMethods})
    expect(inPersonCommunicationMethodSelector(state)).toEqual('667')
  })

  it('returns undefined when communication methods are empty', () => {
    const state = fromJS({communicationMethods: []})
    expect(inPersonCommunicationMethodSelector(state)).toEqual(undefined)
  })
})
