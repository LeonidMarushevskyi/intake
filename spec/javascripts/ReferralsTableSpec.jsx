import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import ReferralsTable from 'ReferralsTable'
import TestUtils from 'react-addons-test-utils'

describe('ReferralsTable', () => {
  it('renders referral table headings', () => {
    const view = TestUtils.renderIntoDocument(<ReferralsTable />)
    const tr = TestUtils.findRenderedDOMComponentWithTag(view, 'tr')
    expect(tr.textContent).toContain('Name & ID')
    expect(tr.textContent).toContain('Response Time')
    expect(tr.textContent).toContain('Decision')
    expect(tr.textContent).toContain('Report Date')
  })

  it('renders referral attributes', () => {
    const referrals = [{
      attributes: {
        id: 1,
        name: 'My Referral Name',
        reference: 'ABCDEF',
        response_time: 'immediate',
        screening_decision: 'accept_for_investigation',
        created_at: '2016-09-21T14:26:58.042Z'
      }
    }]
    const view = TestUtils.renderIntoDocument(<ReferralsTable referrals={referrals}/>)
    const tbody = TestUtils.findRenderedDOMComponentWithTag(view, 'tbody')
    expect(tbody.textContent).toContain('My Referral Name - ABCDEF')
    expect(tbody.textContent).toContain('Immediate')
    expect(tbody.textContent).toContain('Accept for Investigation')
    expect(tbody.textContent).toContain('09/21/2016')
  })
})
