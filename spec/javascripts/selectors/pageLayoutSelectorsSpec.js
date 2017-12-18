import {getPageHeaderDetailSelector} from 'selectors/pageLayoutSelectors'
import * as screeningPageSelectors from 'selectors/screening/screeningPageSelectors'
import * as investigationSelectors from 'selectors/investigation/investigationSelectors'
import * as screeningSelectors from 'selectors/screeningSelectors'

describe('getPageHeaderDetailSelector', () => {
  it('returns page header details for the dashboard page', () => {
    expect(getPageHeaderDetailSelector('/', {})).toEqual({
      pageHeaderButtonDisabled: false,
      pageHeaderButtonText: 'Start Screening',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'dashboard',
      pageHeaderTitle: 'Dashboard',
    })
  })

  it('returns page header details for a screening page', () => {
    spyOn(screeningPageSelectors, 'getAllCardsAreSavedValueSelector').and.returnValue(false)
    spyOn(screeningSelectors, 'getScreeningTitleSelector').and.returnValue('Screening 1')
    expect(getPageHeaderDetailSelector('/screenings/1', {})).toEqual({
      pageHeaderButtonDisabled: true,
      pageHeaderButtonText: 'Submit',
      pageHeaderHasButton: true,
      pageHeaderLocation: 'screening',
      pageHeaderTitle: 'Screening 1',
    })
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
