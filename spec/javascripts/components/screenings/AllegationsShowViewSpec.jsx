import AllegationsShowView from 'components/screenings/AllegationsShowView'
import React from 'react'
import TestUtils from 'react-addons-test-utils'

describe('AllegationsShowView', () => {
  it('renders allegations show view headings', () => {
    const view = TestUtils.renderIntoDocument(<AllegationsShowView />)
    const tr = TestUtils.findRenderedDOMComponentWithTag(view, 'tr')
    expect(tr.textContent).toContain('Alleged Victim/Children')
    expect(tr.textContent).toContain('Alleged Perpetrator')
    expect(tr.textContent).toContain('Allegation(s)')
  })
})
