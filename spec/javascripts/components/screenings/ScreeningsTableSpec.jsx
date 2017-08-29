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

  it('renders ScreeningRow for each screening', () => {
    const screenings = [{
      id: '33',
      name: 'A new screening',
      screening_decision: 'promote_to_referral',
      screening_decision_detail: 'immediate',
      assignee: 'Robert Jones',
      started_at: '2016-09-21T14:26:58.042Z',
      referral_id: '456',
    }]
    const view = shallow(<ScreeningsTable screenings={screenings} />)
    const screeningRow = view.find('ScreeningRow')
    expect(screeningRow.props()).toEqual({
      id: '33',
      name: 'A new screening',
      decision: 'promote_to_referral',
      decisionDetail: 'immediate',
      assignee: 'Robert Jones',
      startedAt: '2016-09-21T14:26:58.042Z',
      referralId: '456',
    })
  })
})
