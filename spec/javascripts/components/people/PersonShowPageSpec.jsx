import Immutable from 'immutable'
import React from 'react'
import {PersonShowPage} from 'components/people/PersonShowPage'
import {mount} from 'enzyme'

describe('PersonShowPage', () => {
  describe('render', () => {
    let component
    let fetchPerson

    beforeEach(() => {
      fetchPerson = jasmine.createSpy('fetchPerson')
      const person = Immutable.fromJS({
        first_name: 'Kevin',
        last_name: 'McCallister',
        gender: 'male',
        date_of_birth: '11/16/1990',
        ssn: '111223333',
        address: {
          street_address: '671 Lincoln Avenue',
          city: 'Winnetka',
          state: 'IL',
          zip: 60093,
        },
      })
      const props = {
        actions: { fetchPerson: fetchPerson },
        params: {id: 99},
        person: person,
      }
      component = mount(<PersonShowPage {...props} />)
    })

    it('renders the card header', () => {
      expect(component.find('.card-header').text()).toContain('Basic Demographics Card')
    })

    it('renders the person label fields', () => {
      expect(component.find('label').length).toEqual(9)
      expect(component.find('label').nodes.map((element) => element.textContent)).toEqual([
        'First Name',
        'Last Name',
        'Date of birth',
        'Gender',
        'Social security number',
        'Address',
        'City',
        'State',
        'Zip',
      ])
    })

    it('calls fetchPerson action', () => {
      expect(fetchPerson).toHaveBeenCalledWith(99)
    })

    it('renders the person value fields', () => {
      expect(component.find('.card-body').text()).toContain('Kevin')
      expect(component.find('.card-body').text()).toContain('McCallister')
      expect(component.find('.card-body').text()).toContain('Male')
      expect(component.find('.card-body').text()).toContain('11/16/1990')
      expect(component.find('.card-body').text()).toContain('111223333')
      expect(component.find('.card-body').text()).toContain('671 Lincoln Avenue')
      expect(component.find('.card-body').text()).toContain('Winnetka')
      expect(component.find('.card-body').text()).toContain('Illinois')
      expect(component.find('.card-body').text()).toContain('60093')
    })

    it('renders the edit link', () => {
      expect(component.find('Link').length).toEqual(1)
      expect(component.find('Link').props()['aria-label']).toEqual('Edit Person')
      expect(component.find('Link').props().to).toEqual('/people/99/edit')
    })
  })
})
