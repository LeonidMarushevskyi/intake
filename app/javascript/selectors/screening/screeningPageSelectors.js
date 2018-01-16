import {Map} from 'immutable'
import {getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {EDIT_MODE, SHOW_MODE} from 'actions/screeningPageActions'
import {getErrorsSelector as crossReportErrorsSelector} from 'selectors/screening/crossReportShowSelectors'
import {getErrorsSelector as narrativeErrorsSelector} from 'selectors/screening/narrativeShowSelectors'
import {getErrorsSelector as screeningInformationErrorsSelector} from 'selectors/screening/screeningInformationShowSelectors'
import {getErrorsSelector as screeningDecisionErrorsSelector} from 'selectors/screening/decisionShowSelectors'
import {getErrorsSelector as incidentInformationErrorsSelector} from 'selectors/screening/incidentInformationShowSelector'
import {getErrorsSelector as personErrorsSelector} from 'selectors/screening/personShowSelectors'

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

export const getScreeningHasErrorsSelector = (state) => (
  crossReportErrorsSelector(state)
    .merge(narrativeErrorsSelector(state))
    .merge(screeningInformationErrorsSelector(state))
    .merge(screeningDecisionErrorsSelector(state))
    .merge(incidentInformationErrorsSelector(state))
    .some((errors) => !errors.isEmpty())
)

export const getPeopleHaveErrorsSelector = (state) => (
  state.get('participants').map((person) => (
    personErrorsSelector(state, person.get('id')).some((errors) => !errors.isEmpty())
  )).some((errorsPresent) => errorsPresent)
)
