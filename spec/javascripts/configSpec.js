import {isFeatureActive, isFeatureInactive, config} from 'config'

describe('intake config', () => {
  let windowOrg
  beforeEach(() => { windowOrg = window.org })
  afterEach(() => { window.org = windowOrg })

  describe('.config', () => {
    beforeEach(() => {
      window.org = Object.freeze({intake: {config: {test_config: true}}})
    })

    it('references window org intake config', () => {
      expect(config()).toEqual({test_config: true})
    })
  })

  describe('.isFeatureActive', () => {
    describe('when a feature is present in active features', () => {
      beforeEach(() => {
        window.org = Object.freeze({intake: {config: {active_features: ['enabled_feature']}}})
      })

      it('returns true', () => {
        expect(isFeatureActive('enabled_feature')).toEqual(true)
      })
    })

    describe('when a feature is not present in active features', () => {
      beforeEach(() => {
        window.org = Object.freeze({intake: {config: {active_features: []}}})
      })

      it('returns false', () => {
        expect(isFeatureActive('enabled_feature')).toEqual(false)
      })
    })
  })

  describe('.isFeatureInactive', () => {
    describe('when a feature is present in active features', () => {
      beforeEach(() => {
        window.org = Object.freeze({intake: {config: {active_features: ['enabled_feature']}}})
      })

      it('returns false', () => {
        expect(isFeatureInactive('enabled_feature')).toEqual(false)
      })
    })

    describe('when a feature is not present in active features', () => {
      beforeEach(() => {
        window.org = Object.freeze({intake: {config: {active_features: []}}})
      })

      it('returns true', () => {
        expect(isFeatureInactive('enabled_feature')).toEqual(true)
      })
    })
  })
})
