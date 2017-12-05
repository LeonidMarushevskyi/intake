import {getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {EDIT_MODE} from 'actions/screeningPageActions'

export const getCardModeValueSelector = (state, card) => (
  state.getIn(['screeningPage', 'cards', card])
)

export const getCardIsEditableSelector = (state, card) => {
  if (getScreeningIsReadOnlySelector(state)) {
    return false
  } else if (getCardModeValueSelector(state, card) === EDIT_MODE) {
    return false
  } else {
    return true
  }
}
