import Immutable from 'immutable'
import React from 'react'
import {PersonEditPage} from 'components/people/PersonEditPage'
import {browserHistory} from 'react-router'
import {mount} from 'enzyme'

describe('PersonEditPage', () => {
  let component
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
      component = mount(<PersonEditPage {...props} />)
    })

    it('renders the card header', () => {
      expect(component.find('.card-header').text()).toEqual('Edit Basic Demographics Card')
    })

    it('renders the person label fields', () => {
      expect(component.find('label').length).toEqual(11)
      expect(component.find('label').nodes.map((element) => element.textContent)).toEqual([
        'First Name',
        'Middle Name',
        'Last Name',
        'Suffix',
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
      component.setState({
        person: Immutable.fromJS({
          id: 1,
          first_name: 'Kevin',
          middle_name: 'Culkin',
          last_name: 'McCallister',
          suffix: 'PhD',
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

      expect(component.find('#first_name').props().value).toEqual('Kevin')
      expect(component.find('#middle_name').props().value).toEqual('Culkin')
      expect(component.find('#last_name').props().value).toEqual('McCallister')
      expect(component.find('#suffix').props().value).toEqual('PhD')
      expect(component.find('#gender').props().value).toEqual('male')
      expect(component.find('#date_of_birth').props().value).toEqual('11/16/1990')
      expect(component.find('#ssn').props().value).toEqual('111223333')
      expect(component.find('#street_address').props().value).toEqual('671 Lincoln Avenue')
      expect(component.find('#city').props().value).toEqual('Winnetka')
      expect(component.find('#state').props().value).toEqual('IL')
      expect(component.find('#zip').props().value).toEqual(60093)
    })

    it('renders the save button', () => {
      expect(component.find('button.btn-primary').text()).toEqual('Save')
    })

    it('renders the cancel link', () => {
      expect(component.find('Link').text()).toEqual('Cancel')
      expect(component.find('Link').props().to).toEqual('/people/1')
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
      component = mount(<PersonEditPage {...props} />)
    })

    it('dispatches updatePerson', () => {
      const updatedPersonProps = {id: 1, first_name: 'Lisa'}
      component.setState({person: Immutable.fromJS(updatedPersonProps)})
      component.find('button.btn-primary').simulate('click')
      expect(actionsSpy.updatePerson).toHaveBeenCalledWith({person: updatedPersonProps})
    })

    it('redirects to show', () => {
      component.find('button.btn-primary').simulate('click')
      expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/people/1'})
    })
  })
})
