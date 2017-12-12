import {Map} from 'immutable'
import {getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {EDIT_MODE, SHOW_MODE} from 'actions/screeningPageActions'

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

export const getAllCardsAreSavedValueSelector = (state) => {
  const screeningPage = state.get('screeningPage')
  const allCardsSaved = screeningPage.get('cards', Map()).every((cardMode) => cardMode === SHOW_MODE)
  const allPeopleCardsSaved = screeningPage.get('peopleCards', Map()).every((cardMode) => cardMode === SHOW_MODE)
  return allCardsSaved && allPeopleCardsSaved
}
