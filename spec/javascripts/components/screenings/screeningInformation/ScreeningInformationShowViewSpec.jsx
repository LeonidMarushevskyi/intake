import React from 'react'
import Immutable from 'immutable'
import ScreeningInformationShowView from 'components/screenings/ScreeningInformationShowView'
import {shallow} from 'enzyme'

describe('ScreeningInformationShowView', () => {
  let component
  let props
  beforeEach(() => {
    props = {
      onEdit: jasmine.createSpy(),
      screening: Immutable.fromJS({}),
    }
    component = shallow(<ScreeningInformationShowView {...props} />)
  })

  it('render the card headers', () => {
    expect(component.find('.card-header').text()).toContain('Screening Information')
  })

  it('renders the screening show fields', () => {
    const props = {
      onEdit: jasmine.createSpy(),
      screening: Immutable.fromJS({
        name: 'The Rocky Horror Picture Show',
        assignee: 'Michael Bluth',
        started_at: '2016-08-13T10:00:00.000Z',
        ended_at: '2016-08-22T11:00:00.000Z',
        communication_method: 'mail',
        participants: [],
      }),
    }
    component = shallow(<ScreeningInformationShowView {...props} />)
    expect(component.find('ShowField').length).toEqual(5)
    expect(component.find('ShowField[label="Assigned Social Worker"]').props().required)
      .toEqual(true)
    expect(component.find('ShowField[label="Screening Start Date/Time"]').props().required)
      .toEqual(true)
    expect(component.find('ShowField[label="Communication Method"]').props().required)
      .toEqual(true)
    expect(component.find('ShowField[label="Title/Name of Screening"]').html())
      .toContain('The Rocky Horror Picture Show')
    expect(component.find('ShowField[label="Assigned Social Worker"]').html())
      .toContain('Michael Bluth')
    expect(component.find('ShowField[label="Screening Start Date/Time"]').html())
      .toContain('08/13/2016 3:00 AM')
    expect(component.find('ShowField[label="Screening End Date/Time"]').html())
      .toContain('08/22/2016 4:00 AM')
    expect(component.find('ShowField[label="Communication Method"]').html())
      .toContain('Mail')
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit screening information')
  })

  it('calls the onEdit function when edit link is clicked', () => {
    component.find('EditLink').simulate('click')
    expect(props.onEdit).toHaveBeenCalled()
  })

  it('renders the screening show field when the field values are null', () => {
    const screening = Immutable.fromJS({
      assignee: null,
      name: null,
      started_at: null,
      ended_at: null,
      communication_method: null,
    })
    const props = {
      onEdit: jasmine.createSpy(),
      screening: screening,
    }
    component = shallow(<ScreeningInformationShowView {...props} />)
    expect(component.find('ShowField[label="Title/Name of Screening"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Assigned Social Worker"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Screening Start Date/Time"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Screening End Date/Time"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Communication Method"]').html())
      .toContain('<div class="c-gray"></div>')
  })
})
