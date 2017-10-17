import {fromJS} from 'immutable'
import {
  getScreeningWithEditsSelector,
} from 'selectors/crossReportFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('crossReportFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

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
