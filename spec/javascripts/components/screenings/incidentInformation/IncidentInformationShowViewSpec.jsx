import Immutable from 'immutable'
import React from 'react'
import IncidentInformationShowView from 'components/screenings/IncidentInformationShowView'
import {shallow} from 'enzyme'

describe('IncidentInformationShowView', () => {
  let component
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy()
    component = shallow(
      <IncidentInformationShowView
        screening={Immutable.fromJS({})}
        onEdit={onEdit}
        errors={Immutable.List()}
      />
    )
  })

  it('renders the card header', () => {
    expect(component.find('.card-header').text()).toContain('Incident Information')
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit incident information')
  })

  describe('clicking the edit link', () => {
    beforeEach(() => {
      component.find('EditLink').simulate('click')
    })
    it('switches to edit mode when edit icon is clicked', () => {
      expect(onEdit).toHaveBeenCalled()
    })
  })

  it('render the show fields', () => {
    const screening = Immutable.fromJS({
      incident_date: '2006-01-21',
      incident_county: 'alpine',
      address: {
        street_address: '1500 7th St',
        city: 'Sacramento',
        state: 'CA',
        zip: '95814',
      },
      location_type: 'Juvenile Detention',
    })

    const component = shallow(
      <IncidentInformationShowView
        screening={screening}
        onEdit={onEdit}
        errors={Immutable.List()}
      />
    )
    expect(component.find('ShowField').length).toEqual(7)
    expect(component.find('ShowField[label="Incident Date"]').html())
      .toContain('01/21/2006')
    expect(component.find('ShowField[label="Incident County"]').html())
      .toContain('Alpine')
    expect(component.find('ShowField[label="Address"]').html())
      .toContain('1500 7th St')
    expect(component.find('ShowField[label="City"]').html())
      .toContain('Sacramento')
    expect(component.find('ShowField[label="State"]').html())
      .toContain('California')
    expect(component.find('ShowField[label="Zip"]').html())
      .toContain('95814')
    expect(component.find('ShowField[label="Location Type"]').html())
      .toContain('Juvenile Detention')
  })

  it('renders show fields correctly when values are not set', () => {
    const screening = Immutable.fromJS({
      incident_date: null,
      incident_county: null,
      address: {
        street_address: null,
        city: null,
        state: null,
        zip: null,
      },
      location_type: null,
    })
    const component = shallow(
      <IncidentInformationShowView
        screening={screening}
        onEdit={onEdit}
        errors={Immutable.List()}
      />
    )
    expect(component.find('ShowField').length).toEqual(7)
    expect(component.find('ShowField[label="Incident Date"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Incident County"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Address"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="City"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="State"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Zip"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Location Type"]').html())
      .toContain('<div class="c-gray"></div>')
  })
})
