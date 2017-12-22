import {getInvestigationTitleSelector} from 'selectors/investigation/investigationSelectors'
import {getScreeningTitleSelector, getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {getAllCardsAreSavedValueSelector} from 'selectors/screening/screeningPageSelectors'
import {isFeatureActive} from 'common/config'

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
    const pageHeaderHasButton =
      !((getScreeningIsReadOnlySelector(state) || isFeatureActive('release_two')))
    return {
      pageHeaderButtonDisabled: !getAllCardsAreSavedValueSelector(state),
      pageHeaderButtonText: 'Submit',
      pageHeaderHasButton: pageHeaderHasButton,
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
