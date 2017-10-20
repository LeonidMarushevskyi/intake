import * as matchers from 'jasmine-immutable-matchers'
import {getAgencyCodeToName, getSelectedCrossReportAgencyNames} from 'selectors/crossReportShowSelectors'
import {fromJS} from 'immutable'

describe('getAgencyCodeToName', () => {
  it('returns nothing when no agnecy_code', () => {
    const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
    const crossReports = [{agencies: [{type: 'DISTRICT_ATTORNEY'}]}]
    const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
    expect(getAgencyCodeToName(state)).toEqual({})
  })
  it('returns the name and type when all data present', () => {
    const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
    const crossReports = [{agencies: [{type: 'DISTRICT_ATTORNEY', id: 'A324ad'}]}]
    const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
    expect(getAgencyCodeToName(state)).toEqual({A324ad: 'District attorney - County Agency'})
  })
  it('returns agency type and id when county agency does not have a name', () => {
    const countyAgencies = [{id: 'A324ad'}]
    const crossReports = [{agencies: [{type: 'COUNTY_LICENSING', id: 'A324ad'}]}]
    const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
    expect(getAgencyCodeToName(state)).toEqual({A324ad: 'County licensing - A324ad'})
  })
  it('returns agency type and id when county agnecies empty', () => {
    const countyAgencies = [{id: 'B525ad', name: 'Other Agency'}]
    const crossReports = [{agencies: [{type: 'LAW_ENFORCEMENT', id: 'A324ad'}]}]
    const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
    expect(getAgencyCodeToName(state)).toEqual({A324ad: 'Law enforcement - A324ad'})
  })
  it('returns only types when no county agencies', () => {
    const countyAgencies = []
    const crossReports = [{agencies: [{type: 'DISTRICT_ATTORNEY', id: 'A324ad'}]}]
    const state = fromJS({countyAgencies, screening: {cross_reports: crossReports}})
    expect(getAgencyCodeToName(state)).toEqual({A324ad: 'District attorney - A324ad'})
  })
  it('returns empty map when cross reports is undefined', () => {
    const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
    const state = fromJS({countyAgencies, screening: {}})
    expect(getAgencyCodeToName(state)).toEqual({})
  })
  it('returns empty map when cross reports are empty', () => {
    const countyAgencies = [{id: 'A324ad', name: 'County Agency'}]
    const state = fromJS({countyAgencies, screening: {cross_reports: []}})
    expect(getAgencyCodeToName(state)).toEqual({})
  })
  it('returns empty map when cross reports and county agencies are empty', () => {
    const state = fromJS({countyAgencies: [], screening: {cross_reports: []}})
    expect(getAgencyCodeToName(state)).toEqual({})
  })
})
describe('getSelectedCrossReportAgencyNames', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers)
  })
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
    expect(getSelectedCrossReportAgencyNames(state)).toEqualImmutable(fromJS([
      'District attorney - County A Agency',
      'Law enforcement - County B Agency',
      'Community care licensing - County C Agency',
      'County licensing - County D Agency',
    ]))
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
    expect(getSelectedCrossReportAgencyNames(state)).toEqualImmutable(fromJS([
      'District attorney - County A Agency',
      'Law enforcement - County B Agency',
      'Community care licensing',
      'County licensing',
    ]))
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
    expect(getSelectedCrossReportAgencyNames(state)).toEqualImmutable(fromJS([
      'District attorney - A324ad',
      'Law enforcement - A325ad',
      'Community care licensing - County C Agency',
      'County licensing - County D Agency',
    ]))
  })
})
