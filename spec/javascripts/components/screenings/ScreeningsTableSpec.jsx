import React from 'react'
import ScreeningsTable from 'components/screenings/ScreeningsTable'
import TestUtils from 'react-addons-test-utils'

describe('ScreeningsTable', () => {
  it('renders screening table headings', () => {
    const view = TestUtils.renderIntoDocument(<ScreeningsTable />)
    const tr = TestUtils.findRenderedDOMComponentWithTag(view, 'tr')
    expect(tr.textContent).toContain('Name & ID')
    expect(tr.textContent).toContain('Response Time')
    expect(tr.textContent).toContain('Decision')
    expect(tr.textContent).toContain('Report Date')
  })

  it('renders screening attributes', () => {
    const screenings = [{
      id: '1',
      name: 'My Screening Name',
      reference: 'ABCDEF',
      response_time: 'immediate',
      screening_decision: 'accept_for_investigation',
      created_at: '2016-09-21T14:26:58.042Z',
    }]
    const view = TestUtils.renderIntoDocument(<ScreeningsTable screenings={screenings}/>)
    const tbody = TestUtils.findRenderedDOMComponentWithTag(view, 'tbody')
    expect(tbody.textContent).toContain('My Screening Name - ABCDEF')
    expect(tbody.textContent).toContain('Immediate')
    expect(tbody.textContent).toContain('Accept for Investigation')
    expect(tbody.textContent).toContain('09/21/2016')
  })
})
