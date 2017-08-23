import React from 'react'
import ScreeningsTable from 'screenings/ScreeningsTable'
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
    const screenings = [{id: 1, screening_decision: 'screen_out'}]
    const view = shallow(<ScreeningsTable screenings={screenings}/>)
    const tbody = view.find('tbody')
    expect(tbody.text()).toContain('Screen out')
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
})
