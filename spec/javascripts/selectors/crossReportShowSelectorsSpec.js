import * as matchers from 'jasmine-immutable-matchers'
import {
  getAgencyCodeToNameSelector,
  getAllegationsRequireCrossReportsValueSelector,
  getErrorsSelector,
  getSelectedCrossReportAgencyNamesSelector,
} from 'selectors/crossReportShowSelectors'
import {List, fromJS} from 'immutable'

describe('crossReportShowSelectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers)
  })
  describe('getAllegationsRequireCrossReportsValueSelector', () => {
    it('returns false if allegations require crossReports but are satisfied', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const crossReports = [{agencies: [
        {type: 'DISTRICT_ATTORNEY', id: '123'},
        {type: 'LAW_ENFORCEMENT', id: '124'},
      ]}]
      const allegations = [{
        id: '123',
        screening_id: '124',
        perpetrator_id: '125',
        victim_id: '126',
        allegation_types: [
          'Severe neglect',
          'Physical abuse',
        ],
      }]
      const screening = {allegations, cross_reports: crossReports}
      const state = fromJS({countyAgencies, screening})
      expect(getAllegationsRequireCrossReportsValueSelector(state)).toEqual(false)
    })
    it('returns true if allegations require crossReports', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const crossReports = [{agencies: [{type: 'DISTRICT_ATTORNEY'}]}]
      const allegations = [{
        id: '123',
        screening_id: '124',
        perpetrator_id: '125',
        victim_id: '126',
        allegation_types: [
          'Severe neglect',
          'Physical abuse',
        ],
      }]
      const screening = {allegations, cross_reports: crossReports}
      const state = fromJS({countyAgencies, screening})
      expect(getAllegationsRequireCrossReportsValueSelector(state)).toEqual(true)
    })
    it('returns false if allegations do not require crossReports', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const crossReports = [{agencies: [{type: 'DISTRICT_ATTORNEY'}]}]
      const allegations = [{
        id: '123',
        screening_id: '124',
        perpetrator_id: '125',
        victim_id: '126',
        allegation_types: [
          'General neglect',
          'Caretaker absent/incapacity',
          'At risk, sibling abused',
        ],
      }]
      const screening = {allegations, cross_reports: crossReports}
      const state = fromJS({countyAgencies, screening})
      expect(getAllegationsRequireCrossReportsValueSelector(state)).toEqual(false)
    })
  })
  describe('getErrorsSelector', () => {
    describe('with allegations that require crossReports', () => {
      const allegations = [{
        id: '123',
        screening_id: '124',
        perpetrator_id: '125',
        victim_id: '126',
        allegation_types: [
          'Severe neglect',
          'Physical abuse',
        ],
      }]
      const screening = {
        cross_reports: [],
        allegations,
      }
      const crossReports = [{
        agencies: [
          {type: 'DISTRICT_ATTORNEY'},
          {type: 'LAW_ENFORCEMENT', id: 'A1234'},
        ],
      }]
      it('returns an error on missing district attorney and law enforement', () => {
        expect(getErrorsSelector(fromJS({screening})).get('agencyRequired'))
          .toEqualImmutable(List([
            'Please indicate cross-reporting to district attorney.',
            'Please indicate cross-reporting to law enforcement.',
          ]))
        expect(getErrorsSelector(fromJS({screening})).get('DISTRICT_ATTORNEY'))
          .toEqualImmutable(List([]))
        expect(getErrorsSelector(fromJS({screening})).get('LAW_ENFORCEMENT'))
          .toEqualImmutable(List([]))
      })
      it('returns an error on missing agency', () => {
        expect(getErrorsSelector(fromJS({screening: {cross_reports: crossReports, allegations}})).get('agencyRequired'))
          .toEqualImmutable(List([]))
        expect(getErrorsSelector(fromJS({screening: {cross_reports: crossReports, allegations}})).get('DISTRICT_ATTORNEY'))
          .toEqualImmutable(List([
            'Please enter an agency name.',
          ]))
        expect(getErrorsSelector(fromJS({screening: {cross_reports: crossReports, allegations}})).get('LAW_ENFORCEMENT'))
          .toEqualImmutable(List([]))
      })
    })
    describe('without allegations that require crossReports', () => {
      describe('with agencies', () => {
        const countyAgencies = [
          {id: 'A324ad', name: 'County A Agency'},
          {id: 'A325ad', name: 'County B Agency'},
          {id: 'A326ad', name: 'County C Agency'},
          {id: 'A327ad', name: 'County D Agency'},
          {id: 'A328ad', name: 'County F Agency'},
        ]
        const crossReports = [{
          agencies: [
            {type: 'DISTRICT_ATTORNEY'},
            {type: 'LAW_ENFORCEMENT'},
            {type: 'COMMUNITY_CARE_LICENSING'},
            {type: 'COUNTY_LICENSING'},
            {type: 'DEPARTMENT_OF_JUSTICE'},
          ],
        }]
        it('returns an error on informDate', () => {
          const state = fromJS({screening: {cross_reports: crossReports}})
          expect(getErrorsSelector(state).get('informDate'))
            .toEqualImmutable(List(['Please enter a cross-report date.']))
        })
        it('returns an error on method', () => {
          const state = fromJS({screening: {cross_reports: crossReports}})
          expect(getErrorsSelector(state).get('method'))
            .toEqualImmutable(List(['Please select a cross-report communication method.']))
        })
        it('returns errors if agency type is selected without agency', () => {
          const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
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
        it('returns no error on informDate', () => {
          const state = fromJS({screening: {cross_reports: []}})
          expect(getErrorsSelector(state).get('informDate'))
            .toEqualImmutable(List())
        })
        it('returns no error on method', () => {
          const state = fromJS({screening: {cross_reports: []}})
          expect(getErrorsSelector(state).get('method'))
            .toEqualImmutable(List())
        })
        it('returns no errors if agency is not selected', () => {
          const state = fromJS({screening: {cross_reports: []}})
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
  describe('getAgencyCodeToNameSelector', () => {
    it('returns nothing when no agnecy_code', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const crossReports = [{agencies: [{type: 'DISTRICT_ATTORNEY'}]}]
      const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
      expect(getAgencyCodeToNameSelector(state)).toEqual({})
    })
    it('returns the name and type when all data present', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const crossReports = [{agencies: [{type: 'DISTRICT_ATTORNEY', id: 'A324ad'}]}]
      const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
      expect(getAgencyCodeToNameSelector(state)).toEqual({A324ad: 'District attorney - County Agency'})
    })
    it('returns agency type and id when county agency does not have a name', () => {
      const countyAgencies = [{id: 'A324ad'}]
      const crossReports = [{agencies: [{type: 'COUNTY_LICENSING', id: 'A324ad'}]}]
      const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
      expect(getAgencyCodeToNameSelector(state)).toEqual({A324ad: 'County licensing - A324ad'})
    })
    it('returns agency type and id when county agnecies empty', () => {
      const countyAgencies = [{id: 'B525ad', name: 'Other Agency'}]
      const crossReports = [{agencies: [{type: 'LAW_ENFORCEMENT', id: 'A324ad'}]}]
      const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
      expect(getAgencyCodeToNameSelector(state)).toEqual({A324ad: 'Law enforcement - A324ad'})
    })
    it('returns only types when no county agencies', () => {
      const countyAgencies = []
      const crossReports = [{agencies: [{type: 'DISTRICT_ATTORNEY', id: 'A324ad'}]}]
      const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
      expect(getAgencyCodeToNameSelector(state)).toEqual({A324ad: 'District attorney - A324ad'})
    })
    it('returns empty map when cross reports is undefined', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const state = fromJS({countyAgencies, screening: {}})
      expect(getAgencyCodeToNameSelector(state)).toEqual({})
    })
    it('returns empty map when cross reports are empty', () => {
      const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
      const state = fromJS({countyAgencies, screening: {cross_reports: []}})
      expect(getAgencyCodeToNameSelector(state)).toEqual({})
    })
    it('returns empty map when cross reports and county agencies are empty', () => {
      const state = fromJS({countyAgencies: [], screening: {cross_reports: []}})
      expect(getAgencyCodeToNameSelector(state)).toEqual({})
    })
  })
  describe('getSelectedCrossReportAgencyNamesSelector', () => {
    it('returns type and name when both are present', () => {
      const countyAgencies = [
        {id: 'A324ad', name: 'County A Agency'},
        {id: 'A325ad', name: 'County B Agency'},
        {id: 'A326ad', name: 'County C Agency'},
        {id: 'A327ad', name: 'County D Agency'},
      ]
      const crossReports = [{
        agencies: [
          {type: 'DISTRICT_ATTORNEY', id: 'A324ad'},
          {type: 'LAW_ENFORCEMENT', id: 'A325ad'},
          {type: 'COMMUNITY_CARE_LICENSING', id: 'A326ad'},
          {type: 'COUNTY_LICENSING', id: 'A327ad'},
        ],
      }]
      const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
      expect(getSelectedCrossReportAgencyNamesSelector(state)).toEqualImmutable(fromJS({
        DISTRICT_ATTORNEY: 'District attorney - County A Agency',
        LAW_ENFORCEMENT: 'Law enforcement - County B Agency',
        COMMUNITY_CARE_LICENSING: 'Community care licensing - County C Agency',
        COUNTY_LICENSING: 'County licensing - County D Agency',
      }))
    })
    it('returns type when only type is there', () => {
      const countyAgencies = [
        {id: 'A324ad', name: 'County A Agency'},
        {id: 'A325ad', name: 'County B Agency'},
        {id: 'A326ad', name: 'County C Agency'},
        {id: 'A327ad', name: 'County D Agency'},
      ]
      const crossReports = [{
        agencies: [
          {type: 'DISTRICT_ATTORNEY', id: 'A324ad'},
          {type: 'LAW_ENFORCEMENT', id: 'A325ad'},
          {type: 'COMMUNITY_CARE_LICENSING'},
          {type: 'COUNTY_LICENSING'},
        ],
      }]
      const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
      expect(getSelectedCrossReportAgencyNamesSelector(state)).toEqualImmutable(fromJS({
        DISTRICT_ATTORNEY: 'District attorney - County A Agency',
        LAW_ENFORCEMENT: 'Law enforcement - County B Agency',
        COMMUNITY_CARE_LICENSING: 'Community care licensing',
        COUNTY_LICENSING: 'County licensing',
      }))
    })
    it('returns id when both are present but not in agencyCodeToName map', () => {
      const countyAgencies = [
        {id: 'A326ad', name: 'County C Agency'},
        {id: 'A327ad', name: 'County D Agency'},
      ]
      const crossReports = [{
        agencies: [
          {type: 'DISTRICT_ATTORNEY', id: 'A324ad'},
          {type: 'LAW_ENFORCEMENT', id: 'A325ad'},
          {type: 'COMMUNITY_CARE_LICENSING', id: 'A326ad'},
          {type: 'COUNTY_LICENSING', id: 'A327ad'},
        ],
      }]
      const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
      expect(getSelectedCrossReportAgencyNamesSelector(state)).toEqualImmutable(fromJS({
        DISTRICT_ATTORNEY: 'District attorney - A324ad',
        LAW_ENFORCEMENT: 'Law enforcement - A325ad',
        COMMUNITY_CARE_LICENSING: 'Community care licensing - County C Agency',
        COUNTY_LICENSING: 'County licensing - County D Agency',
      }))
    })
  })
})
