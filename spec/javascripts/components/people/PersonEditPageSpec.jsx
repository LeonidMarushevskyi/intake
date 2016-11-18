import Immutable from 'immutable'
import React from 'react'
import {PersonEditPage} from 'components/people/PersonEditPage'
import {browserHistory} from 'react-router'
import {mount} from 'enzyme'

describe('PersonEditPage', () => {
  let wrapper
  let actionsSpy
  describe('render', () => {
    beforeEach(() => {
      actionsSpy = {
        fetchPerson: jasmine.createSpy(),
      }
      const props = {
        params: {id: 1},
        person: Immutable.Map(),
        actions: actionsSpy,
      }
      wrapper = mount(<PersonEditPage {...props} />)
    })

    it('renders the card header', () => {
      expect(wrapper.find('.card-header').text()).toEqual('Edit Person')
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

    it('renders the person input fields', () => {
      wrapper.setState({
        person: Immutable.fromJS({
          id: 1,
          first_name: 'Kevin',
          last_name: 'McCallister',
          gender: 'male',
          date_of_birth: '11/16/1990',
          ssn: '111223333',
          address: {
            id: 2,
            street_address: '671 Lincoln Avenue',
            city: 'Winnetka',
            state: 'IL',
            zip: 60093,
          },
        }),
      })

      expect(wrapper.find('#first_name').props().value).toEqual('Kevin')
      expect(wrapper.find('#last_name').props().value).toEqual('McCallister')
      expect(wrapper.find('#gender').props().value).toEqual('male')
      expect(wrapper.find('#date_of_birth').props().value).toEqual('11/16/1990')
      expect(wrapper.find('#ssn').props().value).toEqual('111223333')
      expect(wrapper.find('#street_address').props().value).toEqual('671 Lincoln Avenue')
      expect(wrapper.find('#city').props().value).toEqual('Winnetka')
      expect(wrapper.find('#state').props().value).toEqual('IL')
      expect(wrapper.find('#zip').props().value).toEqual(60093)
    })

    it('renders the save button', () => {
      expect(wrapper.find('button.btn-primary').text()).toEqual('Save')
    })

    it('renders the cancel link', () => {
      expect(wrapper.find('Link').text()).toEqual('Cancel')
      expect(wrapper.find('Link').props().to).toEqual('/people/1')
    })

    it('dispatches fetchPerson', () => {
      expect(actionsSpy.fetchPerson).toHaveBeenCalledWith(1)
    })
  })

  describe('update', () => {
    beforeEach(() => {
      actionsSpy = {
        fetchPerson: jasmine.createSpy('fetchPerson'),
        updatePerson: jasmine.createSpy('updatePerson'),
      }
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      promiseSpyObj.then.and.callFake((then) => then())
      actionsSpy.updatePerson.and.returnValue(promiseSpyObj)
      spyOn(browserHistory, 'push')

      const props = {
        params: {id: 1},
        person: Immutable.Map({id: 1, first_name: 'Bart'}),
        actions: actionsSpy,
      }
      wrapper = mount(<PersonEditPage {...props} />)
    })

    it('dispatches updatePerson', () => {
      const updatedPersonProps = {id: 1, first_name: 'Lisa'}
      wrapper.setState({person: Immutable.fromJS(updatedPersonProps)})
      wrapper.find('button.btn-primary').simulate('click')
      expect(actionsSpy.updatePerson).toHaveBeenCalledWith({person: updatedPersonProps})
    })

    it('redirects to show', () => {
      wrapper.find('button.btn-primary').simulate('click')
      expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/people/1'})
    })
  })
})
