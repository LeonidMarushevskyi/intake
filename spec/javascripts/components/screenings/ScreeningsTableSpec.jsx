import React from 'react'
import ScreeningsTable from 'screenings/ScreeningsTable'
import {shallow, mount} from 'enzyme'

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

  it('renders screening attributes', () => {
    const screenings = [{
      id: '1',
      name: 'My Screening Name',
      reference: 'ABCDEF',
      screening_decision: 'screen_out',
      assignee: 'Bad Wolf',
      started_at: '2016-09-21T14:26:58.042Z',
    }]
    const view = mount(<ScreeningsTable screenings={screenings}/>)
    const tbody = view.find('tbody')
    expect(tbody.text()).toContain('My Screening Name - ABCDEF')
    expect(tbody.text()).toContain('Screen out')
    expect(tbody.text()).toContain('Bad Wolf')
    expect(tbody.text()).toContain('09/21/2016')
  })
})
