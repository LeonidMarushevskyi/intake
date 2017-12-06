import {getCardModeValueSelector, getCardIsEditableSelector} from 'selectors/screening/screeningPageSelectors'
import {fromJS} from 'immutable'

describe('screeningPageSelectors', () => {
  describe('getCardModeValueSelector', () => {
    it('returns the current mode for a given card', () => {
      const screeningPage = {cards: {'some-card': 'show'}}
      const state = fromJS({screeningPage})
      expect(getCardModeValueSelector(state, 'some-card')).toEqual('show')
    })
  })

  describe('getCardIsEditableSelector', () => {
    it('returns false if the screening is read only', () => {
      const screening = {referral_id: '123'}
      const screeningPage = {cards: {'some-card': 'show'}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(false)
    })

    it('returns false if the card is already in edit mode', () => {
      const screening = {referral_id: ''}
      const screeningPage = {cards: {'some-card': 'edit'}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(false)
    })

    it('returns true if the card is in show mode and the screening is not read only', () => {
      const screening = {referral_id: ''}
      const screeningPage = {cards: {'some-card': 'show'}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(true)
    })
  })
})
