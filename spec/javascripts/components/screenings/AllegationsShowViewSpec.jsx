import AllegationsShowView from 'components/screenings/AllegationsShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsShowView', () => {
  it('renders allegations show view headings', () => {
    const component = shallow(<AllegationsShowView />)
    expect(component.text()).toContain('Alleged Victim/Children')
    expect(component.text()).toContain('Alleged Perpetrator')
    expect(component.text()).toContain('Allegation(s)')
  })
})
