import {getInvestigationTitleSelector} from 'selectors/investigation/investigationSelectors'
import {getScreeningTitleSelector, getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {
  getAllCardsAreSavedValueSelector,
  getScreeningHasErrorsSelector,
  getPeopleHaveErrorsSelector,
} from 'selectors/screening/screeningPageSelectors'
import {isFeatureActive} from 'common/config'

const getDashboardDetailSelector = () => ({
  pageHeaderButtonDisabled: false,
  pageHeaderButtonText: isFeatureActive('release_two') ? 'Start Snapshot' : 'Start Screening',
  pageHeaderHasButton: true,
  pageHeaderLocation: 'dashboard',
  pageHeaderTitle: 'Dashboard',
})

const getSnapshotDetailSelector = () => ({
  pageHeaderButtonDisabled: false,
  pageHeaderButtonText: 'Start Over',
  pageHeaderHasButton: true,
  pageHeaderLocation: 'snapshot',
  pageHeaderTitle: 'Snapshot',
})

const getScreeningDetailSelector = (state) => {
  const buttonDisabled = (
    !getAllCardsAreSavedValueSelector(state) ||
    getScreeningHasErrorsSelector(state) ||
    getPeopleHaveErrorsSelector(state)
  )
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
  } else if (path.includes('snapshot')) {
    pageHeaderDetails = getSnapshotDetailSelector()
  }
  return pageHeaderDetails
}
