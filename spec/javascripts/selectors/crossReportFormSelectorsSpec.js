import {fromJS, List, Seq} from 'immutable'
import {
  getAllegationsRequireCrossReportsValueSelector,
  getVisibleErrorsSelector,
  getTouchedFieldsSelector,
  getTouchedAgenciesSelector,
  getErrorsSelector,
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

  function getCrossReportState({
    county_id = {
      value: '',
      touched: false,
    },
    inform_date = {
      value: '',
      touched: false,
    },
    method = {
      value: '',
      touched: false,
    },
    COMMUNITY_CARE_LICENSING = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    COUNTY_LICENSING = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    DEPARTMENT_OF_JUSTICE = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    DISTRICT_ATTORNEY = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    LAW_ENFORCEMENT = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
  }) {
    return {
      county_id,
      inform_date,
      method,
      COMMUNITY_CARE_LICENSING,
      COUNTY_LICENSING,
      DEPARTMENT_OF_JUSTICE,
      DISTRICT_ATTORNEY,
      LAW_ENFORCEMENT,
    }
  }
  describe('getAllegationsRequireCrossReportsValueSelector', () => {
    it('returns false if allegations require crossReports but are satisfied', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const crossReportForm = getCrossReportState({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '123',
            touched: false,
          },
        },
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            value: '124',
            touched: false,
          },
        },
      })
      const allegationsForm = [{
        perpetratorId: '125',
        victimId: '126',
        allegationTypes: [
          'Severe neglect',
          'Physical abuse',
        ],
      }]
      const state = fromJS({crossReportForm, countyAgencies, allegationsForm})
      expect(getAllegationsRequireCrossReportsValueSelector(state)).toEqual(false)
    })
    it('returns true if allegations require crossReports', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const crossReportForm = getCrossReportState({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
        LAW_ENFORCEMENT: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
      })
      const allegationsForm = [{
        perpetratorId: '125',
        victimId: '126',
        allegationTypes: [
          'Severe neglect',
          'Physical abuse',
        ],
      }]
      const state = fromJS({crossReportForm, countyAgencies, allegationsForm})
      expect(getAllegationsRequireCrossReportsValueSelector(state)).toEqual(true)
    })
    it('returns false if allegations do not require crossReports', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const crossReportForm = getCrossReportState({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
        LAW_ENFORCEMENT: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
      })
      const allegationsForm = [{
        perpetratorId: '125',
        victimId: '126',
        allegationTypes: [
          'General neglect',
          'Caretaker absent/incapacity',
          'At risk, sibling abused',
        ],
      }]
      const state = fromJS({crossReportForm, countyAgencies, allegationsForm})
      expect(getAllegationsRequireCrossReportsValueSelector(state)).toEqual(false)
    })
  })
  describe('getTouchedAgenciesSelector', () => {
    it('returns the CrossReportForm agency names that are touched', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        inform_date: {
          value: '2016-08-12',
          touched: true,
        },
        COUNTY_LICENSING: {
          selected: true,
          touched: true,
          agency: {
            id: '123',
            touched: true,
          },
        },
      })})
      expect(getTouchedAgenciesSelector(state)).toEqualImmutable(Seq([
        'COUNTY_LICENSING',
      ]))
    })

    it('returns empty list when no contact', () => {
      const state = fromJS({crossReportForm: getCrossReportState({})})
      expect(getTouchedAgenciesSelector(state)).toEqualImmutable(Seq())
    })
  })
  describe('getTouchedFieldsSelector', () => {
    it('returns the CrossReportForm field names that are touched', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        inform_date: {
          value: '2016-08-12',
          touched: true,
        },
        COUNTY_LICENSING: {
          selected: true,
          touched: true,
          agency: {
            id: '123',
            touched: true,
          },
        },
      })})
      expect(getTouchedFieldsSelector(state)).toEqualImmutable(Seq([
        'inform_date',
        'COUNTY_LICENSING',
      ]))
    })

    it('returns empty list when no contact', () => {
      const state = fromJS({crossReportForm: {}})
      expect(getTouchedFieldsSelector(state)).toEqualImmutable(Seq())
    })
  })
  describe('getVisibleErrorsSelector', () => {
    describe('with allegations that require cross reports', () => {
      const allegationsForm = [{
        perpetratorId: '125',
        victimId: '126',
        allegationTypes: [
          'Severe neglect',
          'Physical abuse',
        ],
      }]
      const crossReportForm = getCrossReportState({
        DISTRICT_ATTORNEY: {
          selected: false,
          touched: true,
          agency: {
            id: '',
            touched: false,
          },
        },
        LAW_ENFORCEMENT: {
          selected: false,
          touched: true,
          agency: {
            id: '',
            touched: false,
          },
        },
      })
      describe('with no fields touched', () => {
        const crossReportForm = getCrossReportState({
          DISTRICT_ATTORNEY: {
            selected: false,
            touched: false,
            agency: {
              id: '',
              touched: false,
            },
          },
          LAW_ENFORCEMENT: {
            selected: false,
            touched: false,
            agency: {
              id: '',
              touched: false,
            },
          },
        })
        it('returns no errors', () => {
          expect(getVisibleErrorsSelector(fromJS({crossReportForm, allegationsForm})).get('DISTRICT_ATTORNEY'))
            .toEqualImmutable(List([]))
          expect(getVisibleErrorsSelector(fromJS({crossReportForm, allegationsForm})).get('LAW_ENFORCEMENT'))
            .toEqualImmutable(List([]))
        })
      })
      it('returns an error on missing district attorney and law enforement', () => {
        expect(getVisibleErrorsSelector(fromJS({crossReportForm, allegationsForm})).get('DISTRICT_ATTORNEY'))
          .toEqualImmutable(List([
            'Please indicate cross-reporting to district attorney.',
          ]))
        expect(getVisibleErrorsSelector(fromJS({crossReportForm, allegationsForm})).get('LAW_ENFORCEMENT'))
          .toEqualImmutable(List([
            'Please indicate cross-reporting to law enforcement.',
          ]))
      })
    })
    it('does not return the agency names that are not touched', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        COUNTY_LICENSING: {
          selected: true,
          touched: true,
          agency: {
            id: '',
            touched: false,
          },
        },
      })})
      expect(getVisibleErrorsSelector(state).get('COUNTY_LICENSING'))
        .toEqualImmutable(List())
    })
    it('returns the CrossReportForm field names that are touched', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        inform_date: {
          value: '',
          touched: true,
        },
        COUNTY_LICENSING: {
          selected: true,
          touched: true,
          agency: {
            id: '',
            touched: true,
          },
        },
      })})
      expect(getVisibleErrorsSelector(state).get('inform_date'))
        .toEqualImmutable(List(['Please enter a cross-report date.']))
      expect(getVisibleErrorsSelector(state).get('COUNTY_LICENSING'))
        .toEqualImmutable(List(['Please enter an agency name.']))
    })
  })
  describe('getErrorsSelector', () => {
    describe('with allegations that require crossReports', () => {
      const allegationsForm = [{
        perpetratorId: '125',
        victimId: '126',
        allegationTypes: [
          'Severe neglect',
          'Physical abuse',
        ],
      }]
      const crossReportForm = getCrossReportState({})
      it('returns an error on missing district attorney and law enforement', () => {
        expect(getErrorsSelector(fromJS({crossReportForm, allegationsForm})).get('DISTRICT_ATTORNEY'))
          .toEqualImmutable(List([
            'Please indicate cross-reporting to district attorney.',
          ]))
        expect(getErrorsSelector(fromJS({crossReportForm, allegationsForm})).get('LAW_ENFORCEMENT'))
          .toEqualImmutable(List([
            'Please indicate cross-reporting to law enforcement.',
          ]))
      })
      it('returns an error on missing agency', () => {
        const crossReportForm = getCrossReportState({
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              value: '',
              touched: false,
            },
          },
          LAW_ENFORCEMENT: {
            selected: true,
            touched: false,
            agency: {
              value: '2345',
              touched: false,
            },
          },
        })
        expect(getErrorsSelector(fromJS({crossReportForm, allegationsForm})).get('DISTRICT_ATTORNEY'))
          .toEqualImmutable(List([
            'Please enter an agency name.',
          ]))
        expect(getErrorsSelector(fromJS({crossReportForm, allegationsForm})).get('LAW_ENFORCEMENT'))
          .toEqualImmutable(List([]))
      })
    })
    describe('without allegations that require crossReports', () => {
      describe('with agencies', () => {
        it('returns an error on inform_date', () => {
          const state = fromJS({crossReportForm: getCrossReportState({
            inform_date: {value: '', touched: false},
            LAW_ENFORCEMENT: {
              selected: true,
              touched: false,
              agency: {
                value: '',
                touched: false,
              },
            },
          })})
          expect(getErrorsSelector(state).get('inform_date'))
            .toEqualImmutable(List(['Please enter a cross-report date.']))
        })
        it('returns an error on method', () => {
          const state = fromJS({crossReportForm: getCrossReportState({
            method: {value: '', touched: false},
            LAW_ENFORCEMENT: {
              selected: true,
              touched: false,
              agency: {
                value: '',
                touched: false,
              },
            },
          })})
          expect(getErrorsSelector(state).get('method'))
            .toEqualImmutable(List(['Please select cross-report communication method.']))
        })
        it('returns errors if agency type is selected without agency', () => {
          const state = fromJS({crossReportForm: getCrossReportState({
            COMMUNITY_CARE_LICENSING: {
              selected: true,
              touched: false,
              agency: {
                value: '',
                touched: false,
              },
            },
            COUNTY_LICENSING: {
              selected: true,
              touched: false,
              agency: {
                value: '',
                touched: false,
              },
            },
            DEPARTMENT_OF_JUSTICE: {
              selected: true,
              touched: false,
              agency: {
                value: '',
                touched: false,
              },
            },
            DISTRICT_ATTORNEY: {
              selected: true,
              touched: false,
              agency: {
                value: '',
                touched: false,
              },
            },
            LAW_ENFORCEMENT: {
              selected: true,
              touched: false,
              agency: {
                value: '',
                touched: false,
              },
            },
          })})
          expect(getErrorsSelector(state).get('COMMUNITY_CARE_LICENSING'))
            .toEqualImmutable(fromJS(['Please enter an agency name.']))
          expect(getErrorsSelector(state).get('COUNTY_LICENSING'))
            .toEqualImmutable(fromJS(['Please enter an agency name.']))
          expect(getErrorsSelector(state).get('DEPARTMENT_OF_JUSTICE'))
            .toEqualImmutable(fromJS(['Please enter an agency name.']))
          expect(getErrorsSelector(state).get('DISTRICT_ATTORNEY'))
            .toEqualImmutable(fromJS(['Please enter an agency name.']))
          expect(getErrorsSelector(state).get('LAW_ENFORCEMENT'))
            .toEqualImmutable(fromJS(['Please enter an agency name.']))
        })
      })
      describe('without agencies', () => {
        it('returns no error on inform_date', () => {
          const state = fromJS({crossReportForm: getCrossReportState({
            inform_date: {value: '', touched: false},
          })})
          expect(getErrorsSelector(state).get('inform_date'))
            .toEqualImmutable(List())
        })
        it('returns no error on method', () => {
          const state = fromJS({crossReportForm: getCrossReportState({
            method: {value: '', touched: false},
          })})
          expect(getErrorsSelector(state).get('method'))
            .toEqualImmutable(List())
        })
        it('returns no errors if agency is not selected', () => {
          const state = fromJS({crossReportForm: getCrossReportState({})})
          expect(getErrorsSelector(state).get('COMMUNITY_CARE_LICENSING'))
            .toEqualImmutable(List())
          expect(getErrorsSelector(state).get('COUNTY_LICENSING'))
            .toEqualImmutable(List())
          expect(getErrorsSelector(state).get('DEPARTMENT_OF_JUSTICE'))
            .toEqualImmutable(List())
          expect(getErrorsSelector(state).get('DISTRICT_ATTORNEY'))
            .toEqualImmutable(List())
          expect(getErrorsSelector(state).get('LAW_ENFORCEMENT'))
            .toEqualImmutable(List())
        })
      })
    })
  })
  describe('getDistrictAttorneyFormSelector', () => {
    it('returns data from form for DISTRICT_ATTORNEY', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })})
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
  })
  describe('getDepartmentOfJusticeFormSelector', () => {
    it('returns data from form for DEPARTMENT_OF_JUSTICE', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        DEPARTMENT_OF_JUSTICE: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })})
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
  })
  describe('getLawEnforcementFormSelector', () => {
    it('returns data from form for LAW_ENFORCEMENT', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })})
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
  })
  describe('getCountyLicensingFormSelector', () => {
    it('returns data from form for COUNTY_LICENSING', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        COUNTY_LICENSING: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })})
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
  })
  describe('getCommunityCareLicensingFormSelector', () => {
    it('returns data from form for COMMUNITY_CARE_LICENSING', () => {
      const state = fromJS({crossReportForm: getCrossReportState({
        COMMUNITY_CARE_LICENSING: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
      })})
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
  })
  describe('getScreeningWithEditsSelector', () => {
    it('returns a screening with an updated cross_reports if the form has a value', () => {
      const screening = {cross_reports: []}
      const crossReportForm = getCrossReportState({
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
