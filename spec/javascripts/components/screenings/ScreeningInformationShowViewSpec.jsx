import React from 'react'
import Immutable from 'immutable'
import ScreeningInformationShowView from 'components/screenings/ScreeningInformationShowView'
import {shallow} from 'enzyme'

describe('ScreeningInformationShowView', () => {
  let component
  beforeEach(() => {
    component = shallow(<ScreeningInformationShowView screening={Immutable.Map({})} />)
  })

  it('render the card headers', () => {
    expect(component.find('.card-header').text()).toEqual('Screening Information')
  })

  it('renders the screening show fields', () => {
    const screening = Immutable.fromJS({
      name: 'The Rocky Horror Picture Show',
      started_at: '2016-08-13T10:00:00.000Z',
      ended_at: '2016-08-22T11:00:00.000Z',
      communication_method: 'mail',
    })
    component = shallow(<ScreeningInformationShowView screening={screening} />)
    expect(component.find('ShowField').length).toEqual(4)
    expect(component.find('ShowField[label="Title/Name of Screening"]').html())
      .toContain('The Rocky Horror Picture Show')
    expect(component.find('ShowField[label="Screening Start Date/Time"]').html())
      .toContain('08/13/2016 10:00 AM')
    expect(component.find('ShowField[label="Screening End Date/Time"]').html())
      .toContain('08/22/2016 11:00 AM')
    expect(component.find('ShowField[label="Communication Method"]').html())
      .toContain('Mail')
  })

  it('renders the screening show field when the field values are null', () => {
    const screening = Immutable.fromJS({
      name: null,
      started_at: null,
      ended_at: null,
      communication_method: null,
    })

    component = shallow(<ScreeningInformationShowView screening={screening} />)
    expect(component.find('ShowField[label="Title/Name of Screening"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Screening Start Date/Time"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Screening End Date/Time"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Communication Method"]').html())
      .toContain('<div class="c-gray"></div>')
  })
})
