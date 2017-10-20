import CrossReportShow from 'screenings/CrossReportShow'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportShow', () => {
  function renderCrossReportShow({
    agencies = [],
    alertInfoMessage = undefined,
    communicationMethod = '',
    county = '',
    hasAgencies = false,
    reportedOn = '',
  }) {
    const props = {
      agencies,
      alertInfoMessage,
      communicationMethod,
      county,
      hasAgencies,
      reportedOn,
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
      const agencies = ['District attorney']
      const reportedOn = '2017-01-15'
      const hasAgencies = true
      const component = renderCrossReportShow({agencies, hasAgencies, reportedOn})
      const field = component.find('ShowField[label="Cross Reported on Date"]')
      expect(field.props().children).toEqual('01/15/2017')
    })
    it('communicationMethod', () => {
      const agencies = ['District attorney']
      const communicationMethod = 'Smoke Signal'
      const hasAgencies = true
      const component = renderCrossReportShow({agencies, hasAgencies, communicationMethod})
      const field = component.find('ShowField[label="Communication Method"]')
      expect(field.props().children).toEqual('Smoke Signal')
    })
    it('cross report agency type and code names', () => {
      const agencies = [
        'District attorney',
        'Law enforcement - Police Department',
      ]
      const hasAgencies = true
      const component = renderCrossReportShow({agencies, hasAgencies})
      expect(component.find('li').first().text()).toEqual('District attorney')
      expect(component.find('li').last().text()).toEqual('Law enforcement - Police Department')
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
