import {fromJS} from 'immutable'
import {
  getScreeningWithEditsSelector,
  getDistrictAttorneyFormSelector,
  getDepartmentOfJusticeFormSelector,
  getLawEnforcementFormSelector,
  getCountyLicensingFormSelector,
  getCommunityCareLicensingFormSelector,
} from 'selectors/crossReportFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('crossReportFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getDistrictAttorneyFormSelector', () => {
    it('returns data from form for DISTRICT_ATTORNEY', () => {
      const crossReportForm = fromJS({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })
      const state = fromJS({crossReportForm})
      expect(getDistrictAttorneyFormSelector(state))
        .toEqualImmutable(fromJS({
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        }))
    })
    it('returns empty map when no data', () => {
      const crossReportForm = fromJS({})
      const state = fromJS({crossReportForm})
      expect(getDistrictAttorneyFormSelector(state))
        .toEqualImmutable(fromJS({}))
    })
  })
  describe('getDepartmentOfJusticeFormSelector', () => {
    it('returns data from form for DEPARTMENT_OF_JUSTICE', () => {
      const crossReportForm = fromJS({
        DEPARTMENT_OF_JUSTICE: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })
      const state = fromJS({crossReportForm})
      expect(getDepartmentOfJusticeFormSelector(state))
        .toEqualImmutable(fromJS({
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        }))
    })
    it('returns empty map when no data', () => {
      const crossReportForm = fromJS({})
      const state = fromJS({crossReportForm})
      expect(getDepartmentOfJusticeFormSelector(state))
        .toEqualImmutable(fromJS({}))
    })
  })
  describe('getLawEnforcementFormSelector', () => {
    it('returns data from form for LAW_ENFORCEMENT', () => {
      const crossReportForm = fromJS({
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })
      const state = fromJS({crossReportForm})
      expect(getLawEnforcementFormSelector(state))
        .toEqualImmutable(fromJS({
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        }))
    })
    it('returns empty map when no data', () => {
      const crossReportForm = fromJS({})
      const state = fromJS({crossReportForm})
      expect(getLawEnforcementFormSelector(state))
        .toEqualImmutable(fromJS({}))
    })
  })
  describe('getCountyLicensingFormSelector', () => {
    it('returns data from form for COUNTY_LICENSING', () => {
      const crossReportForm = fromJS({
        COUNTY_LICENSING: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })
      const state = fromJS({crossReportForm})
      expect(getCountyLicensingFormSelector(state))
        .toEqualImmutable(fromJS({
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        }))
    })
    it('returns empty map when no data', () => {
      const crossReportForm = fromJS({})
      const state = fromJS({crossReportForm})
      expect(getCountyLicensingFormSelector(state))
        .toEqualImmutable(fromJS({}))
    })
  })
  describe('getCommunityCareLicensingFormSelector', () => {
    it('returns data from form for COMMUNITY_CARE_LICENSING', () => {
      const crossReportForm = fromJS({
        COMMUNITY_CARE_LICENSING: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })
      const state = fromJS({crossReportForm})
      expect(getCommunityCareLicensingFormSelector(state))
        .toEqualImmutable(fromJS({
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        }))
    })
    it('returns empty map when no data', () => {
      const crossReportForm = fromJS({})
      const state = fromJS({crossReportForm})
      expect(getCommunityCareLicensingFormSelector(state))
        .toEqualImmutable(fromJS({}))
    })
  })
  describe('getScreeningWithEditsSelector', () => {
    it('returns a screening with an updated cross_reports if the form has a value', () => {
      const screening = {cross_reports: []}
      const crossReportForm = fromJS({
        county_id: {
          value: '1234',
          touched: true,
        },
        inform_date: {
          value: '2017-02-20',
          touched: false,
        },
        method: {
          value: 'Child Abuse Form',
          touched: true,
        },
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            value: '5234',
            touched: true,
          },
        },
        DEPARTMENT_OF_JUSTICE: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
        COUNTY_LICENSING: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
        COMMUNITY_CARE_LICENSING: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
      })
      const state = fromJS({screening, crossReportForm})
      expect(getScreeningWithEditsSelector(state))
        .toEqualImmutable(fromJS({
          cross_reports: [
            {
              county_id: '1234',
              inform_date: '2017-02-20',
              method: 'Child Abuse Form',
              agencies: [
                {type: 'DISTRICT_ATTORNEY', id: '1234'},
                {type: 'LAW_ENFORCEMENT', id: '5234'},
              ],
            },
          ],
        }))
    })
  })
})
