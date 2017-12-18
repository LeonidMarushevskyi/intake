import {getInvestigationTitleSelector} from 'selectors/investigation/investigationSelectors'
import {getScreeningTitleSelector} from 'selectors/screeningSelectors'
import {getAllCardsAreSavedValueSelector} from 'selectors/screening/screeningPageSelectors'

export const getPageHeaderDetailSelector = (path, state) => {
  if (path === '/') {
    return {
      pageHeaderButtonDisabled: false,
      pageHeaderButtonText: 'Start Screening',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'dashboard',
      pageHeaderTitle: 'Dashboard',
    }
  } else if (path.includes('screenings')) {
    return {
      pageHeaderButtonDisabled: !getAllCardsAreSavedValueSelector(state),
      pageHeaderButtonText: 'Submit',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'screening',
      pageHeaderTitle: getScreeningTitleSelector(state),
    }
  } else if (path.includes('contacts')) {
    return {
      pageHeaderHasButton: false,
      pageHeaderLocation: 'contact',
      pageHeaderTitle: `Contact for ${getInvestigationTitleSelector(state)}`,
    }
  } else if (path.includes('investigations')) {
    return {
      pageHeaderHasButton: false,
      pageHeaderLocation: 'investigation',
      pageHeaderTitle: getInvestigationTitleSelector(state),
    }
  }
  return {pageHeaderTitle: '', pageHeaderButton: null}
}
