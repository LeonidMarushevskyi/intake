import PersonShowPage from 'PersonShowPage'
import React from 'react'
import {mount} from 'enzyme'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

describe('PersonShowPage', () => {
  beforeEach(() => {
    const xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
  })

  describe('render', () => {
    let wrapper
    beforeEach(() => {
      const props = {params: {id: 99}}
      wrapper = mount(<PersonShowPage {...props} />)
    })

    it('renders the card header', () => {
      expect(wrapper.find('.card-header').text()).toContain('Profile Information')
    })

    it('renders the person label fields', () => {
      expect(wrapper.find('label').length).toEqual(9)
      expect(wrapper.find('label').nodes.map((element) => element.textContent)).toEqual([
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

    it('renders the person value fields', () => {
      wrapper.setState({
        person: Immutable.fromJS({
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
        }),
      })
      expect(wrapper.find('.card-body').text()).toContain('Kevin')
      expect(wrapper.find('.card-body').text()).toContain('McCallister')
      expect(wrapper.find('.card-body').text()).toContain('Male')
      expect(wrapper.find('.card-body').text()).toContain('11/16/1990')
      expect(wrapper.find('.card-body').text()).toContain('111223333')
      expect(wrapper.find('.card-body').text()).toContain('671 Lincoln Avenue')
      expect(wrapper.find('.card-body').text()).toContain('Winnetka')
      expect(wrapper.find('.card-body').text()).toContain('Illinois')
      expect(wrapper.find('.card-body').text()).toContain('60093')
    })

    it('renders the edit link', () => {
      expect(wrapper.find('Link').length).toEqual(1)
      expect(wrapper.find('Link').props()['aria-label']).toEqual('Edit Person')
      expect(wrapper.find('Link').props().to).toEqual('/people/99/edit')
    })
  })

  describe('fetch', () => {
    it('GETs the person data to the server', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<PersonShowPage {...props} />)
      wrapper.instance().fetch()
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/people/1.json')
    })
  })
})
