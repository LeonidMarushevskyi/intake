import CrossReportShow from 'screenings/CrossReportShow'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportShow', () => {
  function renderCrossReportShow({
    agencies = undefined,
    agencyCodeToName = {},
    alertInfoMessage = undefined,
    communicationMethod = '',
    county = '',
    reportedOn = '',
  }) {
    const props = {
      agencies,
      agencyCodeToName,
      alertInfoMessage,
      communicationMethod,
      county,
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
      const agencies = [{type: 'DISTRICT_ATTORNEY'}]
      const reportedOn = '2017-01-15'
      const component = renderCrossReportShow({agencies, reportedOn})
      const field = component.find('ShowField[label="Cross Reported on Date"]')
      expect(field.props().children).toEqual('01/15/2017')
    })
    it('communicationMethod', () => {
      const agencies = [{type: 'DISTRICT_ATTORNEY'}]
      const communicationMethod = 'Smoke Signal'
      const component = renderCrossReportShow({agencies, communicationMethod})
      const field = component.find('ShowField[label="Communication Method"]')
      expect(field.props().children).toEqual('Smoke Signal')
    })
    it('cross report agency type and code names', () => {
      const agencies = [
        {type: 'DISTRICT_ATTORNEY'},
        {type: 'LAW_ENFORCEMENT', id: '1234'},
      ]
      const agencyCodeToName = {
        1234: 'Law enforcement - Police Department',
      }
      const component = renderCrossReportShow({agencyCodeToName, agencies})
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
