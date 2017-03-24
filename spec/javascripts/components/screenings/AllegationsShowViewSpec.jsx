import AllegationsShowView from 'components/screenings/AllegationsShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsShowView', () => {
  it('renders allegations show view headings', () => {
    const component = shallow(<AllegationsShowView onEdit={() => {}}/>)
    expect(component.text()).toContain('Alleged Victim/Children')
    expect(component.text()).toContain('Alleged Perpetrator')
    expect(component.text()).toContain('Allegation(s)')
  })

  it('calls the onEdit function when edit link is clicked', () => {
    const onEdit = jasmine.createSpy()
    const event = jasmine.createSpyObj('event', ['preventDefault'])
    const component = shallow(<AllegationsShowView onEdit={onEdit}/>)
    expect(component.find('EditLink').length).toEqual(1)
    component.find('EditLink').simulate('click', event)
    expect(onEdit).toHaveBeenCalled()
  })
})
