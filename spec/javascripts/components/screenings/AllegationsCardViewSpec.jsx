import AllegationsCardView from 'components/screenings/AllegationsCardView'
import React from 'react'
import TestUtils from 'react-addons-test-utils'

describe('AllegationsCardView', () => {
  it('renders allegations card view headings', () => {
    const view = TestUtils.renderIntoDocument(<AllegationsCardView />)
    const tr = TestUtils.findRenderedDOMComponentWithTag(view, 'tr')
    expect(tr.textContent).toContain('Alleged Victim/Children')
    expect(tr.textContent).toContain('Alleged Perpetrator')
    expect(tr.textContent).toContain('Allegation(s)')
  })
})
