import React from 'react'
import ScreeningsTable from 'screenings/ScreeningsTable'
import moment from 'moment'
import {shallow} from 'enzyme'

describe('ScreeningsTable', () => {
  it('renders screening table headings', () => {
    const view = shallow(<ScreeningsTable />)
    const tr = view.find('tr')
    expect(tr.text()).toContain('Screening Name')
    expect(tr.text()).toContain('Type/Decision')
    expect(tr.text()).toContain('Status')
    expect(tr.text()).toContain('Assignee')
    expect(tr.text()).toContain('Report Date and Time')
  })

  it('renders link to screening with name', () => {
    const screenings = [{id: '1', name: 'My Screening Name'}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const link = view.find('Link')
    expect(link.props().to).toEqual('/screenings/1')
    expect(link.html()).toEqual('<a>My Screening Name</a>')
  })

  it('renders link to screening with ID when name is not present', () => {
    const screenings = [{id: '123', name: null}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const link = view.find('Link')
    expect(link.props().to).toEqual('/screenings/123')
    expect(link.html()).toEqual('<a>123</a>')
  })

  it('renders decision', () => {
    const screenings = [{id: 1, screening_decision: 'differential_response'}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const tbody = view.find('tbody')
    expect(tbody.text()).toContain('Differential response')
  })

  it('renders response time if decision is promote to referral', () => {
    const screenings = [{id: 1, screening_decision: 'promote_to_referral', screening_decision_detail: 'immediate'}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const tbody = view.find('tbody')
    expect(tbody.text()).not.toContain('Promote to referral')
    expect(tbody.text()).toContain('Immediate')
  })

  it('renders category if decision is screen out', () => {
    const screenings = [{id: 1, screening_decision: 'screen_out', screening_decision_detail: 'evaluate_out'}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const tbody = view.find('tbody')
    expect(tbody.text()).not.toContain('Screen out')
    expect(tbody.text()).toContain('Evaluate out')
  })

  it('renders assignee', () => {
    const screenings = [{id: 1, assignee: 'Bad Wolf'}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const tbody = view.find('tbody')
    expect(tbody.text()).toContain('Bad Wolf')
  })

  it('renders report date and time', () => {
    const screenings = [{id: 1, started_at: '2016-09-21T14:26:58.042Z'}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const tbody = view.find('tbody')
    expect(tbody.text()).toContain('09/21/2016 7:26 AM')
  })

  it('renders time from now', () => {
    const screenings = [{id: 1, started_at: moment().subtract(1, 'year').format()}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const tbody = view.find('tbody')
    expect(tbody.text()).toContain('(a year ago)')
  })
})
