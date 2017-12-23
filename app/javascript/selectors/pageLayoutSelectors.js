import {getInvestigationTitleSelector} from 'selectors/investigation/investigationSelectors'
import {getScreeningTitleSelector, getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {getAllCardsAreSavedValueSelector, getScreeningHasErrorsSelector} from 'selectors/screening/screeningPageSelectors'
import {isFeatureActive} from 'common/config'

const getDashboardDetailSelector = () => ({
  pageHeaderButtonDisabled: false,
  pageHeaderButtonText: 'Start Screening',
  pageHeaderHasButton: true,
  pageHeaderLocation: 'dashboard',
  pageHeaderTitle: 'Dashboard',
})

const getScreeningDetailSelector = (state) => {
  const buttonDisabled = (!getAllCardsAreSavedValueSelector(state) || getScreeningHasErrorsSelector(state))
  const hasButton = !((getScreeningIsReadOnlySelector(state) || isFeatureActive('release_two')))
  return {
    pageHeaderButtonDisabled: buttonDisabled,
    pageHeaderButtonText: 'Submit',
    pageHeaderHasButton: hasButton,
    pageHeaderLocation: 'screening',
    pageHeaderTitle: getScreeningTitleSelector(state),
  }
}

const getContactDetailSelector = (state) => ({
  pageHeaderHasButton: false,
  pageHeaderLocation: 'contact',
  pageHeaderTitle: `Contact for ${getInvestigationTitleSelector(state)}`,
})

const getInvestigationDetailSelector = (state) => ({
  pageHeaderHasButton: false,
  pageHeaderLocation: 'investigation',
  pageHeaderTitle: getInvestigationTitleSelector(state),
})

export const getPageHeaderDetailSelector = (path, state) => {
  let pageHeaderDetails = {pageHeaderTitle: '', pageHeaderHasButton: false}
  if (path === '/') {
    pageHeaderDetails = getDashboardDetailSelector()
  } else if (path.includes('screenings')) {
    pageHeaderDetails = getScreeningDetailSelector(state)
  } else if (path.includes('contacts')) {
    pageHeaderDetails = getContactDetailSelector(state)
  } else if (path.includes('investigations')) {
    pageHeaderDetails = getInvestigationDetailSelector(state)
  }
  return pageHeaderDetails
}
