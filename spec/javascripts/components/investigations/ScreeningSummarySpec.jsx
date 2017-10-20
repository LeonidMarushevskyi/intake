import ScreeningSummary from 'investigations/ScreeningSummary'
import React from 'react'
import {shallow} from 'enzyme'

describe('ScreeningSummary', () => {
  it('renders screening summary header', () => {
    const component = shallow(<ScreeningSummary />)
    expect(component.find('.card-header').text()).toContain('Screening Summary')
  })

  it('renders link to screening with name', () => {
    const props = {id: '1', name: 'My Screening Name', screeningId: '123', loaded: true}
    const component = shallow(<ScreeningSummary {...props} />)
    const link = component.find('Link')
    expect(link.props().to).toEqual('/screenings/123')
    expect(link.html()).toEqual('<a>My Screening Name</a>')
  })

  it('renders response time', () => {
    const props = {responseTime: 'Immediate', loaded: true}
    const component = shallow(<ScreeningSummary {...props} />)
    expect(component.find('.card-body').text()).toContain('Immediate')
  })

  it('renders allegations', () => {
    const allegations = ['General neglect', 'Severe neglect', 'Physical abuse']
    const props = {allegations, loaded: true}
    const component = shallow(<ScreeningSummary {...props} />)
    expect(component.find('.card-body').text()).toContain(
      'General neglect, Severe neglect, Physical abuse'
    )
  })

  it('renders alerts', () => {
    const safetyAlerts = ['Dangerous Animal on Premises', 'Dangerous Environment', 'Firearms in Home']
    const props = {safetyAlerts, loaded: true}
    const component = shallow(<ScreeningSummary {...props} />)
    expect(component.find('.card-body').text()).toContain('Dangerous Animal on Premises')
    expect(component.find('.card-body').text()).toContain('Dangerous Environment')
    expect(component.find('.card-body').text()).toContain('Firearms in Home')
  })

  it('renders safety information', () => {
    const props = {safetyInformation: 'The dog is extreemly dangerous', loaded: true}
    const component = shallow(<ScreeningSummary {...props} />)
    expect(component.find('.card-body').text()).toContain(
      'The dog is extreemly dangerous'
    )
  })

  it('renders decision rationale', () => {
    const props = {decisionRationale: 'Evidence of abuse was substantial', loaded: true}
    const component = shallow(<ScreeningSummary {...props} />)
    expect(component.find('.card-body').text()).toContain(
      'Evidence of abuse was substantial'
    )
  })
})
