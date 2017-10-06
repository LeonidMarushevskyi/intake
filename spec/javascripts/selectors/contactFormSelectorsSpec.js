import {fromJS, Seq, Map} from 'immutable'
import {
  getStatusValueSelector,
  getPurposeValueSelector,
  getLocationValueSelector,
  getCommunicationMethodValueSelector,
  getTouchedFieldsSelector,
  getFieldValuesSelector,
} from 'selectors/contactFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('getStatusValueSelector', () => {
  const contactStatuses = [{code: 'A', value: 'Attempted'}]

  it('returns the current contactForm status display value', () => {
    const contactForm = {status: {value: 'A'}}
    const state = fromJS({contactForm, contactStatuses})
    expect(getStatusValueSelector(state)).toEqual('Attempted')
  })

  it('returns undefined when contactForm does not have a status', () => {
    const contactForm = {status: {value: null}}
    const state = fromJS({contactForm, contactStatuses})
    expect(getStatusValueSelector(state)).toEqual(undefined)
  })
})

describe('getPurposeValueSelector', () => {
  const contactPurposes = [{code: '123', value: 'SomePurpose'}]

  it('returns the current contactForm purpose display value', () => {
    const contactForm = {purpose: {value: '123'}}
    const state = fromJS({contactForm, contactPurposes})
    expect(getPurposeValueSelector(state)).toEqual('SomePurpose')
  })

  it('returns undefined when contactForm does not have a purpose', () => {
    const contactForm = {purpose: {value: null}}
    const state = fromJS({contactForm, contactPurposes})
    expect(getPurposeValueSelector(state)).toEqual(undefined)
  })
})

describe('getLocationValueSelector', () => {
  const locations = [{code: '444', value: 'school'}]

  it('returns the current contactForm location display value', () => {
    const contactForm = {location: {value: '444'}}
    const state = fromJS({contactForm, locations})
    expect(getLocationValueSelector(state)).toEqual('school')
  })

  it('returns undefined when contactForm does not have a location', () => {
    const contactForm = {location: {value: null}}
    const state = fromJS({contactForm, locations})
    expect(getLocationValueSelector(state)).toEqual(undefined)
  })
})

describe('getCommunicationMethodValueSelector', () => {
  const communicationMethods = [{code: '555', value: 'Phone'}]

  it('returns the current contactForm communication methods display value', () => {
    const contactForm = {communication_method: {value: '555'}}
    const state = fromJS({contactForm, communicationMethods})
    expect(getCommunicationMethodValueSelector(state)).toEqual('Phone')
  })

  it('returns undefined when contactForm does not have a communication method', () => {
    const contactForm = {communication_method: {value: null}}
    const state = fromJS({contactForm, communicationMethods})
    expect(getCommunicationMethodValueSelector(state)).toEqual(undefined)
  })
})

describe('getTouchedFieldsSelector', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  it('returns the contactForm field names that are touched', () => {
    const contactForm = {
      fieldA: {touched: false},
      fieldB: {touched: true},
      fieldC: {},
      fieldD: {touched: true},
    }
    const state = fromJS({contactForm})
    expect(getTouchedFieldsSelector(state)).toEqualImmutable(Seq(['fieldB', 'fieldD']))
  })

  it('returns empty list when no contact', () => {
    const contactForm = {}
    const state = fromJS({contactForm})
    expect(getTouchedFieldsSelector(state)).toEqualImmutable(Seq())
  })
})

describe('getFieldValuesSelector', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  it('returns the contactForm field values', () => {
    const contactForm = {
      fieldA: {value: 1},
      fieldB: {},
      fieldC: {value: 2},
    }
    const state = fromJS({contactForm})
    expect(getFieldValuesSelector(state)).toEqualImmutable(
      fromJS({
        fieldA: 1,
        fieldB: undefined,
        fieldC: 2,
      })
    )
  })

  it('returns empty map when no contact', () => {
    const contactForm = {}
    const state = fromJS({contactForm})
    expect(getFieldValuesSelector(state)).toEqualImmutable(Map())
  })
})

