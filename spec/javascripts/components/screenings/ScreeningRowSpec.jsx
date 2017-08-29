import React from 'react'
import ScreeningRow from 'screenings/ScreeningRow'
import moment from 'moment'
import {shallow} from 'enzyme'

describe('ScreeningRow', () => {
  describe('when referral id is not present', () => {
    it('renders link to screening with name', () => {
      const props = {id: '1', name: 'My Screening Name'}
      const view = shallow(<ScreeningRow {...props} />)
      const link = view.find('Link')
      expect(link.props().to).toEqual('/screenings/1')
      expect(link.html()).toEqual('<a>My Screening Name</a>')
    })

    it('renders link to screening with ID when name is not present', () => {
      const props = {id: '123', name: null}
      const view = shallow(<ScreeningRow {...props} />)
      const link = view.find('Link')
      expect(link.props().to).toEqual('/screenings/123')
      expect(link.html()).toEqual('<a>123</a>')
    })
  })

  describe('when referral id is present', () => {
    it('renders link to investigation with name', () => {
      const props = {id: '1', referralId: '456', name: 'My Screening Name'}
      const view = shallow(<ScreeningRow {...props} />)
      const link = view.find('Link')
      expect(link.props().to).toEqual('/investigations/456')
      expect(link.html()).toEqual('<a>My Screening Name</a>')
    })

    it('renders link to investigation with referral id when name is not present', () => {
      const props = {id: '1', referralId: '456', name: null}
      const view = shallow(<ScreeningRow {...props} />)
      const link = view.find('Link')
      expect(link.props().to).toEqual('/investigations/456')
      expect(link.html()).toEqual('<a>456</a>')
    })
  })

  it('renders decision', () => {
    const props = {id: '1', name: null, decision: 'differential_response'}
    const view = shallow(<ScreeningRow {...props} />)
    const tr = view.find('tr')
    expect(tr.text()).toContain('Differential response')
  })

  it('renders response time if decision is promote to referral', () => {
    const props = {id: '1', decision: 'promote_to_referral', decisionDetail: 'immediate'}
    const view = shallow(<ScreeningRow {...props} />)
    const tr = view.find('tr')
    expect(tr.text()).not.toContain('Promote to referral')
    expect(tr.text()).toContain('Immediate')
  })

  it('renders category if decision is screen out', () => {
    const props = {id: '1', decision: 'screen_out', decisionDetail: 'evaluate_out'}
    const view = shallow(<ScreeningRow {...props} />)
    const tr = view.find('tr')
    expect(tr.text()).not.toContain('Screen out')
    expect(tr.text()).toContain('Evaluate out')
  })

  it('renders assignee', () => {
    const props = {id: '1', assignee: 'Bad Wolf'}
    const view = shallow(<ScreeningRow {...props} />)
    const tr = view.find('tr')
    expect(tr.text()).toContain('Bad Wolf')
  })

  it('renders report date and time', () => {
    const props = {id: '1', startedAt: '2016-09-21T14:26:58.042Z'}
    const view = shallow(<ScreeningRow {...props} />)
    const tr = view.find('tr')
    expect(tr.text()).toContain('09/21/2016 7:26 AM')
  })

  it('renders time from now', () => {
    const props = {id: '1', startedAt: moment().subtract(1, 'year').format()}
    const view = shallow(<ScreeningRow {...props} />)
    const tr = view.find('tr')
    expect(tr.text()).toContain('(a year ago)')
  })
})
