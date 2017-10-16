import {getAgencyCodeToName} from 'selectors/countyAgenciesSelectors'
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
