import Immutable from 'immutable'
import React from 'react'
import {PersonShowPage} from 'components/people/PersonShowPage'
import {shallow, mount} from 'enzyme'

describe('PersonShowPage', () => {
  describe('render', () => {
    let component

    beforeEach(() => {
      const person = Immutable.fromJS({
        first_name: 'Kevin',
        middle_name: 'Culkin',
        last_name: 'McCallister',
        name_suffix: 'phd',
        gender: 'male',
        date_of_birth: '11/16/1990',
        ssn: '111223333',
        address: {
          street_address: '671 Lincoln Avenue',
          city: 'Winnetka',
          state: 'IL',
          zip: 60093,
        },
        phone_numbers: [{
          id: '1',
          phone_number:'917-578-2010',
          phone_number_type: 'work',
        }, {
          id: '2',
          phone_number:'517-566-2111',
          phone_number_type: 'home',
        }]
      })
      const props = {
        params: {id: 99},
        actions: { fetchPerson: () => null },
        person: person,
      }
      component = shallow(<PersonShowPage {...props} />)
    })

    it('renders the card header', () => {
      expect(component.find('.card-header').text()).toContain('Basic Demographics Card')
    })

    it('renders the person show fields', () => {
      expect(component.find('ShowField').length).toEqual(15)
      expect(component.find('ShowField[label="First Name"]').html())
        .toContain('Kevin')
      expect(component.find('ShowField[label="Middle Name"]').html())
        .toContain('Culkin')
      expect(component.find('ShowField[label="Last Name"]').html())
        .toContain('McCallister')
      expect(component.find('ShowField[label="Suffix"]').html())
        .toContain('PhD')
      expect(component.find('ShowField[label="Phone Number"]').first().html())
        .toContain('917-578-2010')
      expect(component.find('ShowField[label="Phone Number Type"]').first().html())
        .toContain('Work')
      expect(component.find('ShowField[label="Phone Number"]').last().html())
        .toContain('517-566-2111')
      expect(component.find('ShowField[label="Phone Number Type"]').last().html())
        .toContain('Home')
      expect(component.find('ShowField[label="Date of birth"]').html())
        .toContain('11/16/1990')
      expect(component.find('ShowField[label="Gender"]').html())
        .toContain('Male')
      expect(component.find('ShowField[label="Social security number"]').html())
        .toContain('111223333')
      expect(component.find('ShowField[label="Address"]').html())
        .toContain('671 Lincoln Avenue')
      expect(component.find('ShowField[label="City"]').html())
        .toContain('Winnetka')
      expect(component.find('ShowField[label="State"]').html())
        .toContain('Illinois')
      expect(component.find('ShowField[label="Zip"]').html())
        .toContain('60093')
    })

    it('renders the edit link', () => {
      expect(component.find('Link').length).toEqual(1)
      expect(component.find('Link').props()['aria-label']).toEqual('Edit Person')
      expect(component.find('Link').props().to).toEqual('/people/99/edit')
    })
  })

  describe('componentDidMount', () => {
    let fetchPerson
    beforeEach(() => {
      fetchPerson = jasmine.createSpy('fetchPerson')
      const props = {
        params: {id: 99},
        actions: { fetchPerson: fetchPerson },
        person: Immutable.Map(),
      }
      const component = mount(<PersonShowPage {...props} />)
    })

    it('calls fetchPerson action', () => {
      expect(fetchPerson).toHaveBeenCalledWith(99)
    })
  })
})
