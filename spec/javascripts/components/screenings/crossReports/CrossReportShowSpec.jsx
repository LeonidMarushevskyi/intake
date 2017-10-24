import CrossReportShow from 'screenings/crossReports/CrossReportShow'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportShow', () => {
  function renderCrossReportShow({
    agencies = {},
    errors = {},
    areCrossReportsRequired = false,
    alertInfoMessage = undefined,
    communicationMethod = '',
    county = '',
    hasAgencies = false,
    hasCrossReport = false,
    reportedOn = '',
    requiredCrossReportErrors = [],
  }) {
    const props = {
      agencies,
      areCrossReportsRequired,
      alertInfoMessage,
      communicationMethod,
      county,
      errors,
      hasAgencies,
      hasCrossReport,
      reportedOn,
      requiredCrossReportErrors,
    }
    return shallow(<CrossReportShow {...props} />)
  }

  it('renders the label', () => {
    const component = renderCrossReportShow({})
    expect(component.find('ShowField').exists()).toEqual(true)
    expect(component.find('ShowField').props().label).toEqual('This report has cross reported to:')
  })
  describe('displays data for', () => {
    it('reportedOn', () => {
      const agencies = {
        DISTRICT_ATTORNEY: 'District attorney',
      }
      const reportedOn = '2017-01-15'
      const errors = {informDate: ['Please enter a cross-report date.']}
      const hasCrossReport = true
      const component = renderCrossReportShow({agencies, hasCrossReport, reportedOn, errors})
      const field = component.find('ShowField[label="Cross Reported on Date"]')
      expect(field.props().children).toEqual('01/15/2017')
      expect(field.props().required).toEqual(true)
      expect(field.props().errors).toEqual(errors.informDate)
    })
    it('communicationMethod', () => {
      const agencies = {
        DISTRICT_ATTORNEY: 'District attorney',
      }
      const communicationMethod = 'Smoke Signal'
      const errors = {method: ['Please select a cross-report communication method.']}
      const hasCrossReport = true
      const component = renderCrossReportShow({agencies, hasCrossReport, communicationMethod, errors})
      const field = component.find('ShowField[label="Communication Method"]')
      expect(field.props().children).toEqual('Smoke Signal')
      expect(field.props().required).toEqual(true)
      expect(field.props().errors).toEqual(errors.method)
    })
    it('cross report agency is required errors are passed on', () => {
      const agencies = {}
      const areCrossReportsRequired = true
      const hasAgencies = true
      const hasCrossReport = true
      const requiredCrossReportErrors = [
        'Please indicate cross-reporting to district attorney.',
        'Please indicate cross-reporting to law enforcement.',
      ]
      const component = renderCrossReportShow({agencies, requiredCrossReportErrors, areCrossReportsRequired, hasAgencies, hasCrossReport})
      const field = component.find('ShowField[label="This report has cross reported to:"]')
      expect(field.props().required).toEqual(true)
      expect(field.props().errors).toEqual([
        'Please indicate cross-reporting to district attorney.',
        'Please indicate cross-reporting to law enforcement.',
      ])
    })
    it('cross report agency type and code names', () => {
      const agencies = {
        DISTRICT_ATTORNEY: 'District attorney',
        LAW_ENFORCEMENT: 'Law enforcement - Police Department',
      }
      const areCrossReportsRequired = true
      const hasAgencies = true
      const hasCrossReport = true
      const errors = {DISTRICT_ATTORNEY: ['Please enter an agency name.']}
      const component = renderCrossReportShow({agencies, errors, areCrossReportsRequired, hasAgencies, hasCrossReport})
      const field = component.find('ShowField[label="This report has cross reported to:"]')
      expect(field.props().required).toEqual(true)
      expect(component.find('li').first().text()).toContain('District attorney')
      expect(component.find('li').first().find('ErrorMessages').props().errors).toEqual(['Please enter an agency name.'])
      expect(component.find('li').last().text()).toContain('Law enforcement - Police Department')
    })
  })
  describe('Alert info messages', () => {
    it('renders an alert info message when passed', () => {
      const component = renderCrossReportShow({alertInfoMessage: 'Help me, Obi-Wan Kenobi!'})
      expect(component.find('AlertInfoMessage').exists()).toEqual(true)
      expect(component.find('AlertInfoMessage').props().message).toEqual('Help me, Obi-Wan Kenobi!')
    })
    it('does not render an alert info message when none are present', () => {
      const component = renderCrossReportShow({})
      expect(component.find('AlertInfoMessage').exists()).toEqual(false)
    })
  })
})
