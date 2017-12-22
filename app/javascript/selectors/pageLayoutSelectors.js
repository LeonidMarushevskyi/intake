import {getInvestigationTitleSelector} from 'selectors/investigation/investigationSelectors'
import {getScreeningTitleSelector, getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {getAllCardsAreSavedValueSelector} from 'selectors/screening/screeningPageSelectors'
import {isFeatureActive} from 'common/config'

export const getPageHeaderDetailSelector = (path, state) => {
  let pageHeaderDetails = {pageHeaderTitle: '', pageHeaderButton: null}
  if (path === '/') {
    pageHeaderDetails = {
      pageHeaderButtonDisabled: false, pageHeaderButtonText: 'Start Screening',
      pageHeaderHasButton: true, pageHeaderLocation: 'dashboard', pageHeaderTitle: 'Dashboard',
    }
  } else if (path.includes('screenings')) {
    const pageHeaderHasButton = !((getScreeningIsReadOnlySelector(state) || isFeatureActive('release_two')))
    pageHeaderDetails = {
      pageHeaderButtonDisabled: !getAllCardsAreSavedValueSelector(state),
      pageHeaderButtonText: 'Submit', pageHeaderHasButton: pageHeaderHasButton,
      pageHeaderLocation: 'screening', pageHeaderTitle: getScreeningTitleSelector(state),
    }
  } else if (path.includes('contacts')) {
    pageHeaderDetails = {
      pageHeaderHasButton: false, pageHeaderLocation: 'contact',
      pageHeaderTitle: `Contact for ${getInvestigationTitleSelector(state)}`,
    }
  } else if (path.includes('investigations')) {
    pageHeaderDetails = {pageHeaderHasButton: false, pageHeaderLocation: 'investigation',
      pageHeaderTitle: getInvestigationTitleSelector(state)}
  }
  return pageHeaderDetails
}
