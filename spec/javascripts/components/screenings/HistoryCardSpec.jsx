import React from 'react'
import HistoryCard from 'components/screenings/HistoryCard'
import TestUtils from 'react-addons-test-utils'

describe('HistoryCard', () => {
  it('renders history card headings', () => {
    const view = TestUtils.renderIntoDocument(<HistoryCard />)
    const tr = TestUtils.findRenderedDOMComponentWithTag(view, 'tr')
    expect(tr.textContent).toContain('Date')
    expect(tr.textContent).toContain('Type/Status')
    expect(tr.textContent).toContain('County/Office')
    expect(tr.textContent).toContain('People and Roles')
  })
})
