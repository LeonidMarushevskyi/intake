import {getPageHeaderDetailSelector} from 'selectors/pageLayoutSelectors'
import * as screeningPageSelectors from 'selectors/screening/screeningPageSelectors'
import * as investigationSelectors from 'selectors/investigation/investigationSelectors'
import * as screeningSelectors from 'selectors/screeningSelectors'
import * as intakeConfig from 'common/config'

describe('getPageHeaderDetailSelector', () => {
  it('returns page header details for the dashboard page when release two is inactive', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(false)
    expect(getPageHeaderDetailSelector('/', {})).toEqual({
      pageHeaderButtonDisabled: false,
      pageHeaderButtonText: 'Start Screening',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'dashboard',
      pageHeaderTitle: 'Dashboard',
    })
  })

  it('returns page header details for the dashboard page when release two is active', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(true)
    expect(getPageHeaderDetailSelector('/', {})).toEqual({
      pageHeaderButtonDisabled: false,
      pageHeaderButtonText: 'Start Snapshot',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'dashboard',
      pageHeaderTitle: 'Dashboard',
    })
  })

  it('returns page header details for a screening page', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getAllCardsAreSavedValueSelector').and.returnValue(true)
    spyOn(screeningPageSelectors, 'getScreeningHasErrorsSelector').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getPeopleHaveErrorsSelector').and.returnValue(false)
    spyOn(screeningSelectors, 'getScreeningTitleSelector').and.returnValue('Screening 1')
    spyOn(screeningSelectors, 'getScreeningIsReadOnlySelector').and.returnValue(false)
    expect(getPageHeaderDetailSelector('/screenings/1', {})).toEqual({
      pageHeaderButtonDisabled: false,
      pageHeaderButtonText: 'Submit',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'screening',
      pageHeaderTitle: 'Screening 1',
    })
  })

  it('disables the submit button if not all cards are saved in a screening', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getAllCardsAreSavedValueSelector').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getScreeningHasErrorsSelector').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getPeopleHaveErrorsSelector').and.returnValue(false)
    spyOn(screeningSelectors, 'getScreeningTitleSelector').and.returnValue('Screening 1')
    spyOn(screeningSelectors, 'getScreeningIsReadOnlySelector').and.returnValue(false)
    expect(getPageHeaderDetailSelector('/screenings/1', {})).toEqual({
      pageHeaderButtonDisabled: true,
      pageHeaderButtonText: 'Submit',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'screening',
      pageHeaderTitle: 'Screening 1',
    })
  })

  it('disables the submit button if the screening is not valid', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getAllCardsAreSavedValueSelector').and.returnValue(true)
    spyOn(screeningPageSelectors, 'getScreeningHasErrorsSelector').and.returnValue(true)
    spyOn(screeningPageSelectors, 'getPeopleHaveErrorsSelector').and.returnValue(false)
    spyOn(screeningSelectors, 'getScreeningTitleSelector').and.returnValue('Screening 1')
    spyOn(screeningSelectors, 'getScreeningIsReadOnlySelector').and.returnValue(false)
    expect(getPageHeaderDetailSelector('/screenings/1', {})).toEqual({
      pageHeaderButtonDisabled: true,
      pageHeaderButtonText: 'Submit',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'screening',
      pageHeaderTitle: 'Screening 1',
    })
  })

  it('disables the submit button if any person on a screening is not valid', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getAllCardsAreSavedValueSelector').and.returnValue(true)
    spyOn(screeningPageSelectors, 'getScreeningHasErrorsSelector').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getPeopleHaveErrorsSelector').and.returnValue(true)
    spyOn(screeningSelectors, 'getScreeningTitleSelector').and.returnValue('Screening 1')
    spyOn(screeningSelectors, 'getScreeningIsReadOnlySelector').and.returnValue(false)
    expect(getPageHeaderDetailSelector('/screenings/1', {})).toEqual({
      pageHeaderButtonDisabled: true,
      pageHeaderButtonText: 'Submit',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'screening',
      pageHeaderTitle: 'Screening 1',
    })
  })

  it('sets pageHeaderHasButton to true for a new hotline screening', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getAllCardsAreSavedValueSelector').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getScreeningHasErrorsSelector').and.returnValue(false)
    spyOn(screeningSelectors, 'getScreeningTitleSelector').and.returnValue('Screening 1')
    spyOn(screeningSelectors, 'getScreeningIsReadOnlySelector').and.returnValue(false)
    expect(getPageHeaderDetailSelector('/screenings/1', {}).pageHeaderHasButton).toEqual(true)
  })

  it('sets pageHeaderHasButton to false for a submitted screening', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getAllCardsAreSavedValueSelector').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getScreeningHasErrorsSelector').and.returnValue(false)
    spyOn(screeningSelectors, 'getScreeningTitleSelector').and.returnValue('Screening 1')
    spyOn(screeningSelectors, 'getScreeningIsReadOnlySelector').and.returnValue(true)
    expect(getPageHeaderDetailSelector('/screenings/1', {}).pageHeaderHasButton).toEqual(false)
  })

  it('sets pageHeaderHasButton to false for a screening in snapshot', () => {
    spyOn(intakeConfig, 'isFeatureActive').and.returnValue(true)
    spyOn(screeningPageSelectors, 'getAllCardsAreSavedValueSelector').and.returnValue(false)
    spyOn(screeningPageSelectors, 'getScreeningHasErrorsSelector').and.returnValue(false)
    spyOn(screeningSelectors, 'getScreeningTitleSelector').and.returnValue('Screening 1')
    spyOn(screeningSelectors, 'getScreeningIsReadOnlySelector').and.returnValue(false)
    expect(getPageHeaderDetailSelector('/screenings/1', {}).pageHeaderHasButton).toEqual(false)
  })

  it('returns page header details for an Investigation contact page', () => {
    spyOn(investigationSelectors, 'getInvestigationTitleSelector').and.returnValue('Investigation A')
    expect(getPageHeaderDetailSelector('/investigations/1/contacts/1', {})).toEqual({
      pageHeaderHasButton: false,
      pageHeaderLocation: 'contact',
      pageHeaderTitle: 'Contact for Investigation A',
    })
  })

  it('returns page header details for an Investigation page', () => {
    spyOn(investigationSelectors, 'getInvestigationTitleSelector').and.returnValue('Investigation A')
    expect(getPageHeaderDetailSelector('/investigations/1', {})).toEqual({
      pageHeaderHasButton: false,
      pageHeaderLocation: 'investigation',
      pageHeaderTitle: 'Investigation A',
    })
  })
})
